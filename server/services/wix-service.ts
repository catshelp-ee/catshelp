export interface RichContentNode {
  type: string;
  id: string;
  nodes: RichContentNode[];
  textData?: {
    text: string;
    decorations: unknown[];
  };
  headingData?: {
    level: number;
  };
  paragraphData?: Record<string, unknown>;
}

export interface WixDraftPost {
  title: string;
  hashtags?: string[];
  richContent: {
    nodes: RichContentNode[];
  };
}

export interface WixApiResponse {
  draftPost?: { id: string };
  draftPosts?: { id: string }[];
}

export interface CatData {
  title: string;
  description: string;
  name: string;
  age: string;
  genderLabel: string;
  coatColour: string;
  coatLength: string;
  chipNr: string;
  cut: string;
  procedures: string;
  vacc: Date | null;
  rabiesVacc: Date | null;
  wormMedName: string;
  issues: string;
  descriptionOfCharacter: string;
  history: string;
  other: string;
  wishes: string;
  driveId: string;
}

export class WixService {
  private readonly apiKey: string;
  private readonly siteId: string;

  constructor() {
    this.apiKey = process.env.WIX_API_KEY || '';
    this.siteId = process.env.WIX_SITE_ID || '';
  }

  private formatCatAsRichContent(cat: CatData): WixDraftPost {
    // Create rich content nodes for Wix blog format
    const nodes: RichContentNode[] = [
      {
        type: "HEADING",
        id: "heading1",
        nodes: [{
          type: "TEXT",
          id: "text1",
          nodes: [],
          textData: {
            text: cat.title,
            decorations: []
          }
        }],
        headingData: { level: 2 }
      },
      {
        type: "PARAGRAPH",
        id: "description",
        nodes: [{
          type: "TEXT",
          id: "text2",
          nodes: [],
          textData: {
            text: cat.description || '',
            decorations: []
          }
        }],
        paragraphData: {}
      }
    ];

    // Add basic info section
    const basicInfo = [
      `Nimi: ${cat.name || 'Teadmata'}`,
      `Vanus: ${cat.age || 'Teadmata'}`,
      `Sugu: ${cat.genderLabel || 'Teadmata'}`,
      `Karva värv: ${cat.coatColour || 'Teadmata'}`,
      `Karva pikkus: ${cat.coatLength || 'Teadmata'}`,
      `Mikrokiip: ${cat.chipNr || 'Puudub'}`
    ];

    nodes.push({
      type: "HEADING",
      id: "heading2",
      nodes: [{
        type: "TEXT",
        id: "text3",
        nodes: [],
        textData: {
          text: "Põhiinfo",
          decorations: []
        }
      }],
      headingData: { level: 3 }
    });

    basicInfo.forEach((info, index) => {
      nodes.push({
        type: "PARAGRAPH",
        id: `basic_info_${index}`,
        nodes: [{
          type: "TEXT",
          id: `text_basic_${index}`,
          nodes: [],
          textData: {
            text: info,
            decorations: []
          }
        }],
        paragraphData: {}
      });
    });

    return {
      title: cat.title,
      hashtags: ['kassid', 'lemmikloomad', 'varjupaik', `cat-${cat.driveId}`],
      richContent: {
        nodes: nodes
      }
    };
  }

  public async createOrUpdateBlogPost(cat: CatData): Promise<{ success: boolean; message: string; postId?: string }> {
    if (!this.apiKey || !this.siteId) {
      return {
        success: false,
        message: 'Wix API võti või saidi ID puudub. Palun kontrolli keskkonnamuutujaid.'
      };
    }

    try {
      const draftData = this.formatCatAsRichContent(cat);
      
      // Check if draft post already exists for this cat
      const existingDraft = await this.findExistingDraftPost(cat.driveId);
      
      if (existingDraft) {
        // Update existing draft post
        await this.updateDraftPost(existingDraft.id, draftData);
        return {
          success: true,
          message: 'Blogi mustand uuendatud!',
          postId: existingDraft.id
        };
      } else {
        // Create new draft post
        const response = await this.createDraftPost(draftData);
        return {
          success: true,
          message: 'Uus blogi mustand loodud!',
          postId: response.postId
        };
      }
    } catch (error) {
      console.error('Wix API error:', error);
      return {
        success: false,
        message: 'Viga Wix API-ga suhtlemisel. Palun proovi hiljem uuesti.'
      };
    }
  }

  private async findExistingDraftPost(catDriveId: string): Promise<{ id: string } | null> {
    const response = await fetch(`https://www.wixapis.com/blog/v3/draft-posts/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          hashtags: {
            $contains: [`cat-${catDriveId}`]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as WixApiResponse;
    return data.draftPosts && data.draftPosts.length > 0 ? data.draftPosts[0] : null;
  }

  private async createDraftPost(draftData: WixDraftPost): Promise<{ postId: string }> {
    const response = await fetch(`https://www.wixapis.com/blog/v3/draft-posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        draftPost: draftData,
        fieldsets: ['URL', 'RICH_CONTENT']
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as WixApiResponse;
    return { postId: data.draftPost!.id };
  }

  private async updateDraftPost(postId: string, draftData: WixDraftPost): Promise<void> {
    const response = await fetch(`https://www.wixapis.com/blog/v3/draft-posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        draftPost: draftData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

export default WixService;