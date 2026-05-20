import { test, expect, request} from '@playwright/test';
import { api } from '../helpers/pages';
import { testDataKatarzyna,testDataAdditionalNeeds } from '../helpers/testData';

 let token :any;
 

test('API health check', async ({request}) => {
    await api.apiCheck(request);  
});

test('getReservationList',async ({request}) =>{
    await api.getReservationList(request);
});

test('getReservationDetails',async ({request}) =>{ 
    await api.getReservationDetails(request);
});

test('getNonExistingReservation',async({request})=>{
    await api.getNonExistingReservation(request);
});

test('filterReservationByName',async({request})=>{
    await api.filterReservationByName(request);
});

test('getToken',async({request})=>{
    token = await api.getToken(request);
});

test('getTokenWrongPassword',async({request})=>{
    await api.getTokenWrongPassword(request);
});

test('addReservation',async({request})=>{
    await api.addReservation(request,token);
});

test('addReservationAndVerify',async({request})=>{
    await api.addReservationAndVerify(request,token);
});

test('addInvalidReservation',async({request})=>{
    await api.addInvalidReservation(request,token);
});

test('updateReservation',async({request})=>{
    await api.updateReservation(request,token);
});
test('updateReservationUsingPatch',async({request})=>{
    await api.updateReservationUsingPatch(request,token,testDataKatarzyna);
});

test('updateReservationWithoutToken',async({request})=>{
    await api.updateReservationWithoutToken(request);
});

test('updateReservationBasicAuthToken',async({request})=>{
    await api.updateReservationBasicAuthToken(request);
});

test('deleteReservation',async({request})=>{
    await api.deleteReservation(request,token)
})

test('verifyIfReservtionWasDeleted',async({request})=>{
    await api.verifyIfDeleted(request);
})

test('deleteWithoutToken',async({request})=>{
    await api.deleteWithoutToken(request);
})

test('e2eFullFlow',async({request})=>{
     await api.e2eFullFlow(request)
})
