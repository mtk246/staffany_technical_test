import { Request, ResponseToolkit } from "@hapi/hapi";
import * as shiftUsecase from "../../../usecases/shiftUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ICreateShift,
  ISuccessResponse,
  IUpdateShift,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";
import { createVerify } from "crypto";
import { format, set } from "date-fns";

const logger = moduleLogger("shiftController");

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shifts");
  try {
    const filter = req.query;
    const data = await shiftUsecase.find(filter);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const findById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shift by id");
  try {
    const id = req.params.id;
    const data = await shiftUsecase.findById(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const checkExist = async (req: Request, h: ResponseToolkit) => {
  logger.info("Check exist shift");
  console.log(req.payload);
  try{
    const startTime = req.params.startTime;
    const endTime = req.params.endTime;
    const date = req.params.date;
    const data = await shiftUsecase.checkExist(startTime,endTime,date);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Check exist shift successful",
      results: data,
    };
  }catch(error){
    logger.error(error.message);
    return errorHandler(h, error);
  }
};

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Create shift");
  try {
    const body = req.payload as ICreateShift;
    const dateString = body.date.toString();
    const formatDate = format(new Date(dateString), "yyyy-MM-dd");
    const checkId = await shiftUsecase.checkExist(body.startTime,body.endTime,formatDate);
    if(checkId){
      var formatStartTime = checkId.startTime.toString().slice(0,5);
      var formatEndTime = checkId.endTime.toString().slice(0,5);
    }
    if (checkId === null || (formatStartTime !== body.startTime && formatEndTime !== body.endTime && checkId.date !== formatDate)) {
      const data = await shiftUsecase.create(body);
      const res: ISuccessResponse = {
        statusCode: 200,
        message: "Create shift successful",
        results: data,
      };
      return res;
    }else{
      const res: ISuccessResponse = {
        statusCode: 400,
        message: "Can't create shift. Same Shift is already exist",
        results: null,
      };
      return res;
    }
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const updateById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Update shift by id");
  try {
    const id = req.params.id;
    const body = req.payload as IUpdateShift;
    const dateString = body.date.toString();
    const formatDate = format(new Date(dateString), "yyyy-MM-dd");
    const checkId = await shiftUsecase.checkExist(body.startTime, body.endTime, formatDate);
    if (checkId) {
    var formatStartTime = checkId.startTime.toString().slice(0,5);
    var formatEndTime = checkId.endTime.toString().slice(0,5);
    }
    if (checkId === null || (id === checkId.id && formatStartTime === body.startTime && formatEndTime === body.endTime && checkId.date === formatDate)) {
      const data = await shiftUsecase.updateById(id, body);
      const res: ISuccessResponse = {
        statusCode: 200,
        message: "Update shift successful",
        results: data,
      };
      return res;
    }
    else{
      const res: ISuccessResponse = {
        statusCode: 400,
        message: "Can't edit shift. Same Shift is already exist",
        results: null,
      };
      return res;
    }
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const deleteById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Delete shift by id");
  try {
    const id = req.params.id;
    const data = await shiftUsecase.deleteById(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Delete shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};
