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

/* eslint-disable block-scoped-var, no-eq-null, no-unused-vars, no-undef, func-style, no-var */

// following content with 'require' only can be added in git repo file, pls remove it on workflow js file
const tw = require('./test/unit/mock-tw.js');


// GQL - get location info and product info
var queryLocationAndProductInfoByInventoryIdGQL = '{ \
  "query": "query Inventory($tenantId: String!, $inventoryId: String!) { \
inventory: businessObjects( \
simpleFilter: { tenantId: $tenantId, type: Inventory } \
hint: { viewId: \\\"inventoryflow\\\" } \
cursorParams: { first: 1 } \
advancedFilter: { \
 AND: [\
  {\
   EQUALS: [\
    { SELECT: \\\"id\\\", type: STRING } \
    { VALUE: $inventoryId, type: STRING } \
   ] \
  } \
 ] \
} \
) { \
totalCount \
pageInfo { \
 hasNextPage \
 endCursor \
} \
edges { \
 cursor \
 object { \
  id \
  ... on Inventory { \
   location { \
    id \
    locationName \
    city \
   } \
   product { \
    id \
    name \
    partNumber \
    description \
   } \
  } \
 } \
} \
} \
}", \
  "variables": {} \
}';
var tentantId = '';
var additionalInfoName = 'WFID';

function writeLog(title, message) {
  if(!tw.local.logs) 
    tw.local.logs = new tw.object.listOf.toolkit.TWSYS.String();
  
  tw.local.logs[tw.local.logs.listLength] = title + ' : ' + message;
}

function writeError(errorDetail) {
  writeLog('error', errorDetail);
}

function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  }
  catch (e) {
    return false;
  }
}

// initial payload for create actionTaken
function getActionTakenCreateJsonString() {
  writeLog('operation', 'create actionTaken');
  var body = {
    actionDefinition: {
      id: tw.local.workItem.businessObject.actionDefinition.id
    },
    additionalInfo: [
      {
        name: additionalInfoName,
        value: tw.system.currentProcessInstance.id,
        type: 'STRING'
      }
    ],
    status: tw.local.currentStatus,
    tenantId: tw.local.workItem.businessObject.tenantId,
    userAssigned: tw.local.workItem.businessObject.userAssigned
  };
  tw.local.actionTakenBody = JSON.stringify(body);
  writeLog('actionTakenBody', tw.local.actionTakenBody);
}

// initial payload for create new workitem
function getWorkItemCreateJsonString() {
  writeLog('operation', 'create new workitem');
  var body = {
    actionsTaken: [
      { id: tw.local.actionTakenId }    
    ],
    businessObject: {
      id: tw.local.workItem.businessObject.businessObject.id,
      type: tw.local.workItem.businessObject.businessObject.type
    },
    endDate: new Date(),
    id: '',
    priority: 0,
    relatedLinks: [],
    sourceId: tw.local.workItem.businessObject.sourceId,
    sourceType: tw.local.workItem.businessObject.sourceType,
    status: tw.local.currentStatus,
    tenantId: tw.local.workItem.businessObject.tenantId,
    userAssigned: tw.local.workItem.businessObject.userAssigned
  };
  tw.local.workItemBody = JSON.stringify(body);
  writeLog('workItemBody', tw.local.workItemBody);
}

// initial payload for update actionTaken
function getActionTakenUpdateJsonString() {
  writeLog('operation', 'update actionTaken');
  var body = {
    additionalInfo: [
      {
        name: 'WFID',
        value: tw.system.currentProcessInstance.id,
        type: 'STRING'
      }
    ],
    status: tw.local.currentStatus,
    tenantId: tw.local.workItem.businessObject.tenantId
  };
  tw.local.actionTakenBody = JSON.stringify(body);
  writeLog('actionTaken id', tw.local.actionTakenId);
  writeLog('actionTakenBody', tw.local.actionTakenBody);
}

// initial payload for update existing workitem
function getWorkItemUpdateJsonString() {
  writeLog('operation', 'update existing workitem');
  var newActionTaken = { id:tw.local.actionTakenId };
  if(tw.local.workItem.businessObject.actionsTaken) 
    tw.local.workItem.businessObject.actionsTaken
      [tw.local.workItem.businessObject.actionsTaken.listLength] = newActionTaken;
  
  else {
    tw.local.workItem.businessObject.actionsTaken = [];
    tw.local.workItem.businessObject.actionsTaken[0] = newActionTaken;
  }
  var body = {    
    status: tw.local.currentStatus,
    tenantId: tw.local.workItem.businessObject.tenantId,
    actionsTaken: tw.local.workItem.businessObject.actionsTaken
  };
  tw.local.workItemBody = JSON.stringify(body);
  writeLog('existing workitem id', tw.local.workItem.businessObject.id);
  writeLog('workItemBody', tw.local.workItemBody);
}

// initial payload for update work item status
function getWorkItemStatusUpdateJsonString() {
  writeLog('operation', 'update work item status');
  var body = {
    additionalInfo: [
      {
        name: additionalInfoName,
        value: tw.system.currentProcessInstance.id
      }
    ],
    status: tw.local.currentStatus,
    tenantId: tw.local.workItem.businessObject.tenantId
  };
  tw.local.workItemBody = JSON.stringify(body);
  writeLog('existing workitem id', tw.local.workItem.businessObject.id);
  writeLog('workItemBody', tw.local.workItemBody);
}

// get workitem id and set it to local variable
// set data to didUpdateWorkItem variable to show whether update successfully
function setUpWorkItemId() {
  writeLog('operation', 'set workitem id');
  try {
    writeLog('workItemOutput', tw.local.workItemOutput);
    var result = JSON.parse(tw.local.workItemOutput);
    if(!result.id)
      tw.local.didUpdateWorkItem = false;

    else {
      tw.local.workItem.businessObject.id = result.id;
      tw.local.didUpdateWorkItem = true;
    }
  }
  catch (e) {
    writeLog('error', 'setUpWorkItemId' + e);
  }
}

// set data to didUpdateWorkItem variable to show whether update successfully
function validUpdateWorkItem() {
  try{
    var result = JSON.parse(tw.local.workItemOutput);
    if(!result.id)
      tw.local.didUpdateWorkItem = false;

    else
      tw.local.didUpdateWorkItem = true;

    writeLog('didUpdateWorkItem', tw.local.didUpdateWorkItem);
  }
  catch(e) {
    writeError('validUpdateWorkItem:' + e);
  }
}

// check whether update successfully
function validUpdateActionTaken() {
  writeLog('operation', 'valid update actionTaken');
  try{
    var result = JSON.parse(tw.local.actionTakenOutput);
    writeLog('didUpdateActionTaken', result.id);
  }
  catch(e) {
    writeError('validUpdateActionTaken');
  }
}

// get location and part number by inventory id
function queryLocationAndProductInfoByInventoryId() {
  var queryObj = JSON.parse(queryLocationAndProductInfoByInventoryIdGQL);
  queryObj.variables = {
    tenantId: tw.local.workItem.businessObject.tenantId,
    inventoryId: tw.local.workItem.businessObject.businessObject.id
  };
  tw.local.queryLocationAndProductInfoByInventoryIdGQL = JSON.stringify(queryObj);
  writeLog('queryLocationAndProductInfoByInventoryIdGQL',
    tw.local.queryLocationAndProductInfoByInventoryIdGQL);
}

// initialize request form according to GQL query result (inventory by inventory id)
function initializeRequestForm() {
  writeLog('queryLocationAndProductInfoByInventoryIdGQLOutput',
    tw.local.queryLocationAndProductInfoByInventoryIdGQLOutput);
  if (tw.local.queryLocationAndProductInfoByInventoryIdGQLOutput)
    if(isValidJson(tw.local.queryLocationAndProductInfoByInventoryIdGQLOutput)) {
      var results = JSON.parse(tw.local.queryLocationAndProductInfoByInventoryIdGQLOutput);
      var list;
      if(results && results.data && results.data.inventory
              && results.data.inventory.edges && results.data.inventory.edges.length > 0) {
        list = results.data.inventory.edges; // inventory list
        // the transfer location should be a list
        var locationName = list[0].object.location.locationName;
        var partNumber = list[0].object.product.partNumber;
        var description = list[0].object.product.description;
        tw.local.requestForm = {};
        tw.local.requestForm.requestDate = new Date(new Date().getTime());
        tw.local.requestForm.requestingLocation = locationName;
        tw.local.requestForm.productSkuId = partNumber;
        tw.local.requestForm.productSkuDescription = description;
      }
      else
        writeError('inventory result has error');

    }
    else
      writeError('inventory result is not valid Json');


  else
    writeError('inventory result is null');

}

function setRequestor() {
  tw.local.requestForm.requestor = {};
  tw.local.requestForm.requestor.name = tw.system.user.name;
}

// following content only added in git repo file, pls remove it on workflow js file
module.exports = {
  writeLog,
  writeError,
  queryLocationAndProductInfoByInventoryId,
  initializeRequestForm,
  setRequestor,
  isValidJson,
  getWorkItemCreateJsonString,
  getWorkItemUpdateJsonString,
  setUpWorkItemId,
  validUpdateWorkItem,
  getActionTakenCreateJsonString,
  getActionTakenUpdateJsonString,
  getWorkItemStatusUpdateJsonString,
  validUpdateActionTaken
};
