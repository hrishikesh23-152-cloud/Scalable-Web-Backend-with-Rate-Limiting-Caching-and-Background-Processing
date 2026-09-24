import { Router } from "express";
import {healthRouter} from './health.routes'
import {AuthRouter} from './auth.routes'
import { TaskRouter } from "./task.routes";
import { AdminRouter } from "./admin.routes";
import { AdminBannerRouter } from "./admin.banner.routes";
export const Apirouter = Router();

Apirouter.use(healthRouter)
Apirouter.use('/auth',AuthRouter);
Apirouter.use('/task',TaskRouter);
Apirouter.use('/admin',AdminRouter);
Apirouter.use('/admin/banner',AdminBannerRouter)