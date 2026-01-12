import { AnimalRepository } from "@animal/repositories/animal.repository";
import { EmailService } from "@auth/email.service";
import { Injectable } from "@nestjs/common";
import { NotificationService } from "@notification/notification.service";
import { UserRepository } from "@user/user.repository";
import path from "path";
import { BaseCronJob } from "./base-cron-job";
import { DataSource } from "typeorm";
import { ModuleRef } from "@nestjs/core";

type Tasks = {
    [assignee: string]: string[];
};

@Injectable()
export class TodoNotificationJob extends BaseCronJob {
    private userRepository: UserRepository;
    private animalRepository: AnimalRepository;
    private notificationService: NotificationService;
    private emailService: EmailService;

    constructor(
        protected dataSource: DataSource,
        protected moduleRef: ModuleRef,
    ) {
        super(dataSource, moduleRef);
    }

    protected async resolveScopeDependencies() {
        this.animalRepository = await this.moduleRef.resolve(AnimalRepository, this.contextId);
        this.userRepository = await this.moduleRef.resolve(UserRepository, this.contextId);
        this.notificationService = await this.moduleRef.resolve(NotificationService, this.contextId);
        this.emailService = await this.moduleRef.resolve(EmailService, this.contextId);
    }

    public async doWork() {
        const users = await this.userRepository.getUsers();

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


            this.emailService.sendNotificationToUser(
                this.createHtmlTemplate(tasks),
                "Hoiukodu meeldetuletus",
                [user.email],
                [{ filename: "email-cat.jpg", path: path.join(__dirname, "../../assets/email-cat.jpg"), cid: "email-cat" }]
            )
        }
    }

    private renderTasks(tasks: Tasks) {
        let html = "";
        for (const [assignee, labels] of Object.entries(tasks)) {
            html += `<h3 style="margin:0 0 10px 0; color:#333;">${assignee}:</h3>`;
            html += `<ol style="padding-left:20px; margin:0;">`;
            for (const label of labels) {
                html += `<li>${label}</li>`;
            }
            html += `</ol>`;
        }
        return html;
    };


    private createHtmlTemplate(tasks: Tasks) {
        return `
             <body style="font-family: Arial, sans-serif; max-width:600px; border-radius:6px; background-color:#f6f6f6; margin:20px auto; padding:20px;">
                <header style="text-align:center; margin-bottom:20px;">
                    <p style="font-size:12px; color:#666;">
                        Email not displaying correctly? <a href="#" style="color:#0073e6;">View it in your browser</a>.
                    </p>
                    <img src="cid:email-cat" alt="Cat" style="width:100%; height:auto; border-radius:6px;"/>
                    <h2 style="color:#333; margin:20px 0 10px;">Armas hoiukodu, sulle on meeldetuletus</h2>
                </header>

                <section style="font-size:15px; line-height:1.6; color:#333;">
                    <p>
                        See kiri saadeti sulle automaatselt, sest oled Cats Help MTÜ hoiukodu ja meie andmete järgi vajab sinu hoiukiisu peatselt natuke sinu tähelepanu.
                        Allpool leiad teemad, mis vajavad sinu tähelepanu. Kõik juhised ning lisainfo leiad, kui logid sisse meie digitaalsesse hoiukiisude keskkonda.
                    </p>

                    ${this.renderTasks(tasks)}

                    <p>
                        Kui need on kõik juba tehtud, siis palun anna meile sellest teada märkides need digitaalses hoiukisude keskkonnas tehtuks.
                    </p>
                </section>

                <section style="text-align:center; margin:20px 0;">
                    <a href="${process.env.DASHBOARD_LINK}"
                        style="background:#00a6a6; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:bold;">
                        Märgi tehtuks
                    </a>
                </section>

                <footer style="text-align:center; font-size:13px; color:#666;">
                    Kui sul on abi vaja, kirjuta
                    <a href="mailto:abi@catshelp.ee" style="color:#0073e6;">abi@catshelp.ee</a>
                </footer>
            </body>
         `
    };
}
