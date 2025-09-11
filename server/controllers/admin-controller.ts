import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from 'types/inversify-types';
import AdminService from '@services/admin/admin-service'

@injectable()
export default class AdminController {
    constructor(
        @inject(TYPES.AdminService)
        private adminService: AdminService
    ) { }

    public async runCronJob(req: Request, res: Response): Promise<Response> {
        const jobName = req.body.jobName;
        if (req.user.role !== 'ADMIN') {
            return res.sendStatus(403);
        }

        await this.adminService.runJob(jobName);
        return res.sendStatus(200);
    }
}
