import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { NamingStrategyInterface } from "typeorm";
import pluralize from "pluralize";

export class PluralSnakeNamingStrategy
  extends SnakeNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string): string {
    const baseName = customName || pluralize(className);
    return baseName
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase();
  }
}