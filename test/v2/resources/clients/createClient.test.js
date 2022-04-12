import axios from 'axios';
import tickspot from '#src/index';
import responseFactory from '#test/v2/factories/responseFactory';
import userInfo from '#test/v2/fixture/client';
import successfulResponseData from '#test/v2/fixture/clients/createClientFixture.js';
import authenticationErrorTests from '#test/v2/shared/authentication';
import {
  badResponseCallbackTests,
  validResponseCallbackTests,
} from '#test/v2/shared/responseCallback';
import wrongParamsTests from '#test/v2/shared/wrongParams';

jest.mock('axios');
const client = tickspot({ apiVersion: 2, ...userInfo });
const URL = `${client.baseURL}/clients.json`;

describe('#create', () => {
  const clientData = {
    name: 'Test',
    archive: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when API call is successful', () => {
    const requestResponse = responseFactory({
      requestData: clientData,
      responseType: 'created',
      responseData: successfulResponseData,
      URL,
    });

    beforeEach(() => {
      axios.post.mockResolvedValueOnce(requestResponse);
    });

    it('should create the new client', async () => {
      const response = await client.clients.create(clientData);
      expect(response.data.name).toBe(clientData.name);
    });
  });

  authenticationErrorTests({
    requestToExecute: async () => {
      await client.clients.create(clientData);
    },
    URL,
    method: 'post',
  });

  badResponseCallbackTests({
    requestToExecute: async () => {
      await client.clients.create(clientData, {});
    },
    method: 'post',
  });

  validResponseCallbackTests({
    requestToExecute: async () => {
      const dataCallback = jest
        .fn()
        .mockImplementation((data) => ({ newStructure: { ...data } }));
      const response = await client.clients.create(clientData, dataCallback);
      return [response, dataCallback];
    },
    responseData: successfulResponseData,
    method: 'post',
    URL,
  });

  wrongParamsTests({
    requestToExecute: async (requestParams) => {
      await client.clients.create(requestParams);
    },
    URL,
    method: 'post',
    requestData: clientData,
    paramsList: ['name'],
  });
});
