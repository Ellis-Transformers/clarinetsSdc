const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function getProductById(productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: Number(productId),
      },
      include: {
        features: {
          select:{
            feature:true,
            value:true
          }
        }     
      }
    });
  
    return product;
  }
  async function getProducts(page=1, count=5) {
    const skipCount = Number((page===1) ? 0 : page * 5);
    const takeCount = Number(count);
    const products = await prisma.product.findMany({
      skip: skipCount,
      take: takeCount
    });
    return products;
  }
  async function getStylesOfProduct(productId) {
    const stylesOfProduct = await prisma.styles.findMany({
      where: {
        productId: Number(productId),
      },
      include: {
        photos: {
          select: {
            thumbnail_url: true,
            url: true,
          },
        }, // thumbnail_url & url
        sku: {
          select: {
            quantity: true,
            size: true,
            id: true,
          },
        }, // {id {quantity, size}}
      },
    });
    if(stylesOfProduct){
      for(let x = 0; x < stylesOfProduct.length; x++){
        let updated = {};
        for(let y = 0; y < stylesOfProduct[x].sku.length; y++){
          updated[stylesOfProduct[x].sku[y].id] = {
            quantity: stylesOfProduct[x].sku[y].quantity,
            size: stylesOfProduct[x].sku[y].size
          }
        }
        stylesOfProduct[x].sku = updated;
      }
    }
    return {product_id: productId, results: [...stylesOfProduct]};
  }
  
  
  async function getRelatedProductIds(productId) {
    const product = await prisma.related.findMany({
      where: {
        current_product_id: Number(productId),
      },
      select: {
        related_product_id: true,
      },
    });
  
    let cleaned = product.map((e) => e.related_product_id);
    return cleaned;
  }

  module.exports = {
    getProductById,
    getProducts,
    getStylesOfProduct,    
    getRelatedProductIds
  }