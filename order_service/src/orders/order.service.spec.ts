// import { Test, TestingModule } from '@nestjs/testing';
// import { OrdersService } from './orders.service';
// import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
// import { ProductsGrpcService } from 'src/common/services/products-grpc-client.service';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { getModelToken } from '@nestjs/mongoose';
// import { Order } from './interfaces/order.interface';
// import { NotFoundException } from '@nestjs/common';
// import * as moment from 'moment';

// const mockOrderModel = {
//   paginate: jest.fn(),
//   findOne: jest.fn(),
//   findOneAndUpdate: jest.fn(),
//   updateMany: jest.fn(),
//   create: jest.fn(),
// };

// const mockRabbitmqService = {
//   // mock methods if needed
// };

// const mockProductsGrpcService = {
//   getProducts: jest.fn(),
// };

// const mockCacheManager = {
//   get: jest.fn(),
//   set: jest.fn(),
// };

// describe('OrdersService', () => {
//   let service: OrdersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         OrdersService,
//         {
//           provide: getModelToken('Order'),
//           useValue: mockOrderModel,
//         },
//         {
//           provide: RabbitmqService,
//           useValue: mockRabbitmqService,
//         },
//         {
//           provide: ProductsGrpcService,
//           useValue: mockProductsGrpcService,
//         },
//         {
//           provide: CACHE_MANAGER,
//           useValue: mockCacheManager,
//         },
//       ],
//     }).compile();

//     service = module.get<OrdersService>(OrdersService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {
//     it('should create an order successfully', async () => {
//       const ownerId = 'ownerId';
//       const createOrderDto = {
//         product_ids: ['productId1', 'productId2'],
//         // other properties
//       };

//       const mockProducts = [
//         {
//           id: 'productId1',
//           name: 'Product 1',
//           description: 'Desc 1',
//           price: 100,
//         },
//         {
//           id: 'productId2',
//           name: 'Product 2',
//           description: 'Desc 2',
//           price: 200,
//         },
//       ];

//       mockProductsGrpcService.getProducts.mockResolvedValue(mockProducts);
//       mockOrderModel.save = jest.fn().mockResolvedValue(mockProducts);
//       mockCacheManager.set.mockResolvedValue(true);

//       const result = await service.create(ownerId, createOrderDto);
//       expect(result).toEqual(mockProducts);
//       expect(mockOrderModel.save).toHaveBeenCalled();
//     });

//     it('should throw NotFoundException for invalid product IDs', async () => {
//       const ownerId = 'ownerId';
//       const createOrderDto = {
//         product_ids: ['invalidId'],
//         // other properties
//       };

//       mockProductsGrpcService.getProducts.mockResolvedValue([]);

//       await expect(service.create(ownerId, createOrderDto)).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });

//   describe('findMany', () => {
//     it('should return paginated orders', async () => {
//       const mockOrders = [{ id: 'order1' }, { id: 'order2' }];
//       const payload = { page: 1, limit: 20 };
//       const query = { owner_id: 'ownerId' };

//       mockOrderModel.paginate.mockResolvedValue({
//         docs: mockOrders,
//         total: mockOrders.length,
//         page: 1,
//         limit: 20,
//       });

//       const result = await service.findMany(payload, query);
//       expect(result).toEqual({
//         docs: mockOrders,
//         total: mockOrders.length,
//         page: 1,
//         limit: 20,
//       });
//       expect(mockOrderModel.paginate).toHaveBeenCalledWith(
//         query,
//         expect.anything(),
//       );
//     });
//   });

//   describe('getOrder', () => {
//     it('should return an order if found', async () => {
//       const orderId = 'orderId';
//       const ownerId = 'ownerId';
//       const mockOrder = { id: orderId, owner_id: ownerId };

//       mockOrderModel.findOne.mockResolvedValue(mockOrder);

//       const result = await service.getOrder(orderId, ownerId);
//       expect(result).toEqual(mockOrder);
//     });

//     it('should throw NotFoundException if order is not found', async () => {
//       const orderId = 'orderId';
//       const ownerId = 'ownerId';

//       mockOrderModel.findOne.mockResolvedValue(null);

//       await expect(service.getOrder(orderId, ownerId)).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });

//   // Add tests for other methods (update, updateOrder, etc.) following similar patterns.
// });
