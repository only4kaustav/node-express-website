const fs = require('fs');
const util = require('util');

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching products information
 */
class ProductService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the products data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of products name and short name
   */
  async getNames() {
    const data = await this.getData();

    return data.map(product => {
      return { title: product.title, shortname: product.shortname };
    });
  }

  /**
   * Get all gallery
   */
  async getAllGallery() {
    const data = await this.getData();

    const gallery = data.reduce((acc, elm) => {
      if (elm.gallery) {
        acc = [...acc, ...elm.gallery];
      }
      return acc;
    }, []);
    return [...new Set(gallery)];
  }

  /**
   * Get all gallery of a given product
   * @param {*} shortname The products short name
   */
  async getGalleryForProduct(shortname) {
    const data = await this.getData();
    const product = data.find(elm => {
      return elm.shortname === shortname;
    });
    if (!product || !product.gallery) return null;
    return [...new Set(product.gallery)];
  }

  /**
   * Get all related products of a given product
   * @param {*} shortname The products short name
   */
  async getRelatedProducts(shortname) {
    const data = await this.getData();
    const current_product = data.find(elm => {
      return elm.shortname === shortname;
    });
    if (!current_product || !current_product.related) return null;
    return data
    .filter(product => current_product.related.includes(product.shortname))
    .map(product => {
      return {
        shortname: product.shortname,
        title: product.title,
        image: product.image,
      };
    });
  }

  /**
   * Get product information provided a shortname
   * @param {*} shortname
   */
  async getProduct(shortname) {
    const data = await this.getData();
    const product = data.find(elm => {
      return elm.shortname === shortname;
    });
    if (!product) return null;
    return {
      title: product.title,
      shortname: product.shortname,
      description: product.description,
      image: product.image,
      ingredients: product.ingredients,
      sizes: product.sizes,
    };
  }

  /**
   * Returns a list of products with only the basic information
   */
  async getListShort() {
    const data = await this.getData();
    return data.map(product => {
      return {
        shortname: product.shortname,
        title: product.title,
        image: product.image,
      };
    });
  }

  /**
   * Get a list of products
   */
  async getList() {
    const data = await this.getData();
    return data.map(product => {
      return {
        shortname: product.shortname,
        title: product.title,
        summary: product.summary,
        image: product.image,
      };
    });
  }
  
  /**
   * Get a list of products
   */
  async getTopList() {
    const data = await this.getData();
    return data.filter(product => product.top).map(product => {
      return {
        shortname: product.shortname,
        title: product.title,
        summary: product.summary,
        image: product.image,
      };
    });
  }

  /**
   * Fetches products data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data).products;
  }
}

module.exports = ProductService;
