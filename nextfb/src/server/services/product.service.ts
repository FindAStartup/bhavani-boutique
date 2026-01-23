import * as productRepo from '../repositories/product.repo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProductService(formData: any) {
    const {
        name,
        description,
        price,
        category,
        images,
        material_care,
        sustainability_impact,
        delivery_days,
        is_draft,
        stock
    } = formData;

    if (!name || !price || !category) {
        throw new Error('Name, price, and category are required');
    }

    if (!is_draft && (!images || images.length < 4 || images.length > 5)) {
        throw new Error('Please upload 4-5 product images');
    }

    const { data: product, error: productError } = await productRepo.insertProduct({
        name,
        description,
        price,
        category,
        images,
        material_care,
        sustainability_impact,
        delivery_days: delivery_days || 7,
        is_draft: is_draft || false
    });

    if (productError) throw productError;

    if (stock && stock.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stockEntries = stock.map((item: any) => ({
            product_id: product.id,
            size: item.size,
            stock_quantity: item.quantity || 0
        }));

        const { error: stockError } = await productRepo.insertProductStock(stockEntries);

        if (stockError) {
            await productRepo.deleteProductById(product.id);
            throw stockError;
        }
    }

    return product;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProductsService(filters: any = {}) {
    const { data: products, error } = await productRepo.findProducts(filters);
    if (error) throw error;
    return products;
}

export async function getProductByIdService(id: string) {
    const { data: product, error } = await productRepo.findProductById(id);
    if (error) throw new Error('Product not found');
    return product;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProductService(id: string, formData: any) {
    const {
        name,
        description,
        price,
        category,
        images,
        material_care,
        sustainability_impact,
        delivery_days,
        is_draft,
        stock
    } = formData;

    const { data: product, error: productError } = await productRepo.updateProductById(id, {
        name,
        description,
        price,
        category,
        images,
        material_care,
        sustainability_impact,
        delivery_days,
        is_draft,
        updated_at: new Date().toISOString()
    });

    if (productError) throw productError;

    if (stock && stock.length > 0) {
        await productRepo.deleteProductStockByProductId(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stockEntries = stock.map((item: any) => ({
            product_id: id,
            size: item.size,
            stock_quantity: item.quantity || 0
        }));
        await productRepo.insertProductStock(stockEntries);
    }

    return product;
}

export async function deleteProductService(id: string) {
    const { error } = await productRepo.deleteProductById(id);
    if (error) throw error;
    return true;
}
