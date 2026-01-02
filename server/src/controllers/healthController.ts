import { ApiResponse } from "../utils/apiResponse";
import { HealthStatus } from "../types/health";
import { Request, Response} from "express";

export const basicHealthCheck = async (req:Request,res:Response): Promise<any>=>{
    try{
        const healthData: HealthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
            version:'1.0.0',
            enviroment:'development'
        }
        return ApiResponse.success(res, 'server is healthy', healthData)
    } catch(error){
        return ApiResponse.error(res, 'service unavailable');
    }
}