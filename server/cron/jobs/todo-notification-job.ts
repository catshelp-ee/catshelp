import NotificationService from "@notifications/notification-service";
import AnimalRepository from "@repositories/animal-repository";
import UserRepository from "@repositories/user-repository";
import EmailService from "@services/auth/email-service";
import { inject, injectable } from "inversify";
import TYPES from "types/inversify-types";

type Tasks = {
    [assignee: string]: string[];
};

@injectable()
export default class TodoNotificationJob {
    constructor(
        @inject(TYPES.NotificationService)
        private notificationService: NotificationService,
        @inject(TYPES.AnimalRepository)
        private animalRepository: AnimalRepository,
        @inject(TYPES.EmailService)
        private emailService: EmailService,
        @inject(TYPES.UserRepository)
        private userRepository: UserRepository
    ) { }

    public async sendNotifications() {
        const users = await this.userRepository.getAllUsers();

        const renderTasks = (tasks: Tasks) => {
            return Object.entries(tasks).map(([assignee, labels]) => `
                <h3 style="margin:0 0 10px 0; color:#333;">${assignee}:</h3>
                <ol style="padding-left:20px; margin:0;">
                    ${labels.map(label => `<li>${label}</li>`)}
                </ol>   
                `);
        };

        const createHtmlTemplate = (tasks: Tasks) => `
            <body style="font-family: Arial, sans-serif; max-width:600px; border-radius:6px; background-color:#f6f6f6; margin:20px auto; padding:20px;">
                <header style="text-align:center; margin-bottom:20px;">
                    <p style="font-size:12px; color:#666;">
                        Email not displaying correctly? <a href="#" style="color:#0073e6;">View it in your browser</a>.
                    </p>
                    <img src="https://placekitten.com/800/400" alt="Cat" style="width:100%; height:auto; border-radius:6px;"/>
                    <h2 style="color:#333; margin:20px 0 10px;">Armas hoiukodu, sulle on meeldetuletus</h2>
                </header>

                <section style="font-size:15px; line-height:1.6; color:#333;">
                    <p>
                        See kiri saadeti sulle automaatselt, sest oled Cats Help MTÜ hoiukodu ja meie andmete järgi vajab sinu hoiukiisu peatselt natuke sinu tähelepanu. 
                        Allpool leiad teemad, mis vajavad sinu tähelepanu. Kõik juhised ning lisainfo leiad, kui logid sisse meie digitaalsesse hoiukiisude keskkonda.
                    </p>

                    ${renderTasks(tasks)}

                    <p>
                        Kui need on kõik juba tehtud, siis palun anna meile sellest teada märkides need digitaalses hoiukisude keskkonnas tehtuks.
                    </p>
                </section>

                <section style="text-align:center; margin:20px 0;">
                    <a href="catshelp.ee" 
                        style="background:#00a6a6; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:bold;">
                        Märgi tehtuks
                    </a>
                </section>

                <footer style="text-align:center; font-size:13px; color:#666;">
                    Kui sul on abi vaja, kirjuta 
                    <a href="mailto:abi@catshelp.ee" style="color:#0073e6;">abi@catshelp.ee</a>
                </footer>
            </body>
         `;

        for (let index = 0; index < users.length; index++) {
            const user = users[index];

            const animals = await this.animalRepository.getAnimalsByUserId(user.id);

            const notifications = await this.notificationService.processNotifications(animals);

            if (notifications.length === 0) {
                continue;
            }

            const tasks = {};
            for (let index = 0; index < notifications.length; index++) {
                const notification = notifications[index];
                if (!tasks[notification.assignee]) {
                    tasks[notification.assignee] = [];
                }
                tasks[notification.assignee].push(notification.label);
            }


            this.emailService.sendEmail(createHtmlTemplate(tasks), "Hoiukodu meeldetuletus", [user.email]);
        }
    }
}