const productService = require('../../services/products.service.mongoose');
const Product = require('../../models/Product');

jest.mock('../../models/Product');
const eventBus = require('../../events/eventBus');
jest.mock('../../events/eventBus');

describe('Product Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('getById 应该返回争取的产品数据', async () => {
        const mockProduct = { _id: '123', name: '测试苹果', price: 10 };
        Product.findById.mockResolvedValue(mockProduct);

        const result = await productService.getById('123');
        expect(Product.findById).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockProduct);
    })
    test('getById 当产品不存在时应该返回 null', async () => {
        Product.findById.mockResolvedValue(null);
        const result = await productService.getById('999');
        expect(Product.findById).toHaveBeenCalledWith('999');
        expect(result).toBeNull();
    })
    test('create 方法应该在保存成功后触发事件', async () => {
        const mockData = { name: '香蕉', price: 5 };
        const mockSavedProduct = { ...mockData, _id: 'abc' };

        // 模拟保存逻辑
        Product.prototype.save = jest.fn().mockResolvedValue(mockSavedProduct);

        await productService.create(mockData, null);

        // 断言事件是否被发出
        expect(eventBus.emit).toHaveBeenCalledWith('PRODUCT_CREATED', expect.any(Object));
    });
})
