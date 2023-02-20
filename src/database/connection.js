const { where } = require("sequelize");

const create = (obj, model) => {
  try {
    const collection = model.create(obj);
    return collection;
  } catch (error) {
    return error;
  }
};

const findOne = (obj, model) => {
  try {
    const collection = model.findOne({ where: obj });
    return collection;
  } catch (error) {
    return error;
  }
};

const findAll = (obj, model) => {
  try {
    const collection = model.findAll({ where: obj });
    return collection;
  } catch (error) {
    return error;
  }
};

const findAllWithInclude = (obj, model, includeModel, deletedCond) => {
  try {
    const collection = model.findAll({
      where: obj,
      include: [{ model: includeModel, where: deletedCond }],
    });

    return collection;
  } catch (error) {
    return error;
  }
};

const findOneWithOrderAndLimit = (obj, order, model, includeModel) => {
  const collection = model.findAll({
    limit: 1,
    where: obj,
    order: [order],
    include: [{ model: includeModel }],
  });
  return collection;
};
// ["role_id", "ASC"]
// order: [
//   ['id', 'DESC'],
//   ['name', 'ASC'],
// ],

const findOneWithInclude = (obj, model, includeModel, includeWhereObj) => {
  try {
    const collection = model.findOne({
      where: obj,
      include: [{ model: includeModel, where: includeWhereObj }],
    });
    return collection;
  } catch (error) {
    return error;
  }
};
const update = (obj, whereData, model, dataReturning) => {
  try {
    const collection = model.update(obj, {
      where: whereData,
      returning: dataReturning,
    });
    return collection;
  } catch (error) {
    return error;
  }
};

const destroyOne = (obj, model) => {
  const collection = model.destroy({ where: obj });
  return collection;
};

module.exports = {
  create,
  findOne,
  findAll,
  findAllWithInclude,
  findOneWithInclude,
  findOneWithOrderAndLimit,
  update,
  destroyOne,
};
