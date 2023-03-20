/* (C) Copyright 2022 IBM Corporation.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const mockTW = require('./mock-tw.js');
const script = require('../../place-new-order.js');

describe('function isValidJson', () => {
  it('should return true when input value is json data', function() {
    expect(script.isValidJson('123')).toBeTruthy();
  });

  it('should return false when input value is not json data', function() {
    expect(script.isValidJson({})).not.toBeTruthy();
  });
});


describe('function queryLocationAndProductInfoByInventoryId', () => {
  it('should initialize queryLocationAndProductInfoByInventoryId', function() {
    script.queryLocationAndProductInfoByInventoryId();
    let GQL = JSON.parse(mockTW.local.queryLocationAndProductInfoByInventoryIdGQL);
    expect(GQL.variables.inventoryId).not.toEqual(null);
  });
});

describe('function initializeRequestForm', () => {
  it('should initialize initializeRequestForm', function() {
    let sql = {
      'data': {
        'inventory': {
          'edges': [
            {
              'object': {
                'id': 'mockId',
                'location': {
                  'id': 'mockLocationId',
                  'locationName': 'mockLocationName',
                  'city': 'mockCity'
                },
                'product': {
                  'id': 'mockProductId',
                  'name': 'mockProductName',
                  'partNumber': 'mockPartNumber',
                  'description': 'mockDescription'
                }
              }
            }
          ]
        }
      }
    };
    mockTW.local.queryLocationAndProductInfoByInventoryIdGQLOutput = JSON.stringify(sql);
    script.initializeRequestForm();
    expect(mockTW.local.requestForm).toMatchObject({
      productSkuId: 'mockPartNumber',
      requestingLocation: 'mockLocationName',
      productSkuDescription: 'mockDescription'
    });
  });

  it('should inventory result is not valid Json', function() {
    mockTW.local.queryLocationAndProductInfoByInventoryIdGQLOutput = {};
    script.initializeRequestForm();
    expect(mockTW.local.logs[0])
      .toBe('error : inventory result is not valid Json');
  });

  it('should inventory result has error', function() {
    mockTW.local.queryLocationAndProductInfoByInventoryIdGQLOutput = JSON.stringify({ data: {} });
    script.initializeRequestForm();
    expect(mockTW.local.logs[0])
      .toBe('error : inventory result has error');
  });
});

describe('function setRequestor', () => {
  it('should initialize setRequestor', function() {
    script.setRequestor();
    expect(mockTW.local.requestForm.requestor.name).toEqual('name');
  });
});

describe('function getWorkItemCreateJsonString', () => {
  it('should workItemBody has value', function() {
    script.getWorkItemCreateJsonString();
    expect(mockTW.local.workItemBody).not.toEqual('');
  });
});

describe('function getWorkItemUpdateJsonString', () => {
  it('should workItemBody has value', function() {
    script.getWorkItemUpdateJsonString();
    expect(mockTW.local.workItemBody).not.toEqual('');
  });
});

describe('function setUpWorkItemId', () => {
  it('should work item id has value', function() {
    script.setUpWorkItemId();
    expect(mockTW.local.workItem.businessObject.id).not.toEqual('');
  });
  mockTW.local.workItemOutput = '{"id":"idValue"}';
  it('should work item id has value', function() {
    script.setUpWorkItemId();
    expect(mockTW.local.workItem.businessObject.id).toEqual('idValue');
  });
});

describe('function validUpdateWorkItem', () => {
  it('should workItemBody has value', function() {
    script.validUpdateWorkItem();
    expect(mockTW.local.didUpdateWorkItem).toBeTruthy();
  });
});

describe('function writeLog', () => {
  it('should write log info', function() {
    script.writeLog('title','message');
    expect(mockTW.local.logs[0]).toBe('title : message');
  });

  it('should initialize log list', function() {
    mockTW.local.logs = null;
    script.writeLog('title','message');
    expect(mockTW.local.logs).not.toEqual(null);
  });

});

describe('function getActionTakenCreateJsonString', () => {
  it('initial new actionTaken payload should with values', function() {
    script.getActionTakenCreateJsonString();
    let newActionTaken = JSON.parse(mockTW.local.actionTakenBody);
    expect(newActionTaken).toMatchObject({
      'actionDefinition': {
        'id': 'id'
      },
      'additionalInfo': [
        {
          'name': 'WFID',
          'value': 'currentProcessInstanceId'
        }
      ],
      'tenantId': 'tenantId',
      'userAssigned': ''
    });
  });
});

describe('function getActionTakenUpdateJsonString', () => {
  it('initial actionTaken payload should with values', function() {
    script.getActionTakenUpdateJsonString();
    let newActionTaken = JSON.parse(mockTW.local.actionTakenBody);
    expect(newActionTaken).toMatchObject({
      'additionalInfo': [
        {
          'name': 'WFID',
          'value': 'currentProcessInstanceId'
        }
      ],
      'tenantId': 'tenantId'
    });
  });
});

describe('function getWorkItemStatusUpdateJsonString', () => {
  it('initial update workitem payload should with values', function() {
    script.getWorkItemStatusUpdateJsonString();
    let updateWorkItem = JSON.parse(mockTW.local.workItemBody);
    expect(updateWorkItem).toMatchObject({
      'tenantId': 'tenantId'
    });
  });
});

describe('function validUpdateActionTaken', () => {
  it('didUpdateActionTaken flag should have value', function() {
    mockTW.local.logs = {
      listLength: 0
    };
    mockTW.local.actionTakenOutput = '{ \"id\": \"mockActionTakenId\" }';
    script.validUpdateActionTaken();
    expect(mockTW.local.logs[0]).toBe('didUpdateActionTaken : mockActionTakenId');
  });

  it('didUpdateActionTaken flag should be undefined', function() {
    mockTW.local.actionTakenOutput = '{ \"test\": \"mockNewWorkItemId\" }';
    script.validUpdateActionTaken();
    expect(mockTW.local.logs[0]).toBe('didUpdateActionTaken : undefined');
  });

  it('should handle exception when output invalid', function() {
    mockTW.local.actionTakenOutput = '';
    script.validUpdateActionTaken();
    expect(mockTW.local.logs[0]).toBe('error : validUpdateActionTaken');
  });
});
