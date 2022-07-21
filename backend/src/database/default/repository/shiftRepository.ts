import {
  getRepository,
  FindManyOptions,
  FindOneOptions,
  FindConditions,
  DeleteResult,
} from "typeorm";
import moduleLogger from "../../../shared/functions/logger";
import Shift from "../entity/shift";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { count } from "console";
import { array } from "joi";
import { start } from "repl";
import { startTimer } from "winston";

const logger = moduleLogger("shiftRepository");

export const find = async (opts?: FindManyOptions<Shift>): Promise<Shift[]> => {
  logger.info("Find");
  const repository = getRepository(Shift);
  const data = await repository.find(opts);
  return data;
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  logger.info("Find by id");
  const repository = getRepository(Shift);
  const data = await repository.findOne(id, opts);
  return data;
};

export const checkExist = async (
  startTime: string,
  endTime: string,
  date: string,
): Promise<Shift> => {
  logger.info("Check exist");
  const repository = getRepository(Shift);
 const data = await repository.find({
    where: {
      startTime: startTime,
      endTime: endTime,
      date,
    },
 });
  return data.length > 0 ? data[0] : null;
}

export const findOne = async (
  where?: FindConditions<Shift>,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  logger.info("Find one");
  const repository = getRepository(Shift);
  const data = await repository.findOne(where, opts);
  return data;
};

export const create = async (payload: Shift): Promise<Shift> => {
  logger.info("Create");
  const repository = getRepository(Shift);
  const newdata = await repository.save(payload);
  return newdata;
};

export const updateById = async (
  id: string,
  payload: QueryDeepPartialEntity<Shift>
): Promise<Shift> => {
  logger.info("Update by id");
  const repository = getRepository(Shift);
  await repository.update(id, payload);
  return findById(id);
};

export const deleteById = async (
  id: string | string[]
): Promise<DeleteResult> => {
  logger.info("Delete by id");
  const repository = getRepository(Shift);
  return await repository.delete(id);
};
