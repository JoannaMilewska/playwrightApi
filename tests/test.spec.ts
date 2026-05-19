import { test, expect, request} from '@playwright/test';
import { api } from '../helpers/pages';

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


