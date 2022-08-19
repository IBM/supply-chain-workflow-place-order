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

const local = {
  requestForm: {
    requestor: {
      name: ''
    }
  },
  workItem: {
    businessObject: {
      actionTaken: [],
      sourceId: 'sourceId',
      updateReceived: '',
      endDate: '2021-08-26T06:01:32.115Z',
      actionDefinition: {
        id: 'id'
      },
      priority: 2,
      businessObject: {
        id: 'id',
        type: 'Inventory'
      },
      createReceived: '',
      sourceType: 'WorkQueueDefinition',
      userAssigned: '',
      additionalInfo: {},
      tenantId: 'tenantId',
      id: 'id',
      globalIdentifiers: []
    },
    action: ''
  },
  logs: {
    listLength: 0
  },
  didUpdateWorkItem: false,
  didUpdateActionTaken: null,
  queryLocationAndProductInfoByInventoryIdGQLOutput: '{}',
  queryLocationAndProductInfoByInventoryIdGQL: '',
  workItemBody: '',
  actionTakenBody: '',
  workItemOutput: ''
};

const system = {
  coachValidation: class coachValidation {
    static addValidationError() {

    }
  },
  currentProcessInstance: {
    id: 'currentProcessInstanceId'
  },
  user: {
    name: 'name'
  },
  team: class team {
    static hasUser(user) {

    }
  },
  org: class org {
    static findTeamByName() {
      return system.team;
    }
    static findUserByName() {}

  }
};

const object = {
  listOf : {
    toolkit:{
      TWSYS: {
        String: class String {
          static String() {}
        }
      }
    }
  }
};

module.exports = {
  local,
  system,
  object
};
