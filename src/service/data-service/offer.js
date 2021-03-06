'use strict';

const Alias = require(`../models/aliases`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];
    if (needComments) {
      include.push(Alias.COMMENTS);
    }
    const offers = await this._Offer.findAll({include});
    return offers.map((item) => item.get());
  }

  findOne(id) {
    return this._Offer.findByPk(id, {include: [Alias.CATEGORIES]});
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = OfferService;
