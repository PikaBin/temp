'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.post('/addCategory', controller.operator.Ccategory.addCategory);

  router.post('/assignWo', controller.operator.workorder.assignWorkorder);
  router.post('/queryWo', controller.operator.workorder.queryWorkOrder);
};
