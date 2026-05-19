import { test, expect, request} from '@playwright/test';
import { api } from '../helpers/pages';


test('API health check', async ({request}) => {
    await api.apiCheck(request);  
});

test('getReservationList',async ({request}) =>{
    await api.getReservationList(request);

});

test('getReservationDetails',async ({request}) =>{ 
    await api.getReservationDetails(request);

});

