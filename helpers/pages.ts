import { APIRequestContext, expect } from "@playwright/test";
import { credentials } from "./credentials";
import { testDataAdditionalNeeds } from "./testData";

let reservationId: any;
export class api {
  //TC01
  static async apiCheck(request: APIRequestContext): Promise<void> {
    const apiResponse = await request.get("/ping");
    expect(apiResponse.status()).toBe(201);
  }
  //TC02
  static async getReservationList(request: APIRequestContext): Promise<void> {
    const response = await request.get("/booking");
    const reservationList = await response.json();
    expect(response.status()).toBe(200);
    expect(reservationList.length).toBeGreaterThan(0);
    reservationList.forEach((item) => {
      expect(item.bookingid).toEqual(expect.any(Number));
    });
  }
  //TC03
  static async getReservationDetails(
    request: APIRequestContext,
  ): Promise<void> {
    const response = await request.get("/booking/3");
    expect(response.status()).toBe(200);
    const reservationDetails = await response.json();
    expect(reservationDetails).toHaveProperty("firstname");
    expect(reservationDetails).toHaveProperty("lastname");
    expect(reservationDetails).toHaveProperty("totalprice");
    expect(reservationDetails).toHaveProperty("depositpaid");
    expect(reservationDetails).toHaveProperty("bookingdates");
    expect(typeof reservationDetails.totalprice).toBe("number");
    expect(typeof reservationDetails.depositpaid).toBe("boolean");
  }

  //TC04
  static async filterReservationByName(
    request: APIRequestContext,
  ): Promise<void> {
    const response = await request.get(
      "/booking?firstname=Susan&lastname=Jackson",
    );
    expect(response.status()).toBe(200);
    const reservationSusan = await response.json();
    expect(Array.isArray(reservationSusan)).toBe(true);
  }

  //TC05
  static async getNonExistingReservation(
    request: APIRequestContext,
  ): Promise<void> {
    const response = await request.get("/booking/999999999");
    expect(response.status()).toBe(404);
  }

  //TC06
  static async getToken(request: APIRequestContext): Promise<string> {
    const response = await request.post("/auth", {
      data: {
        username: credentials.username,
        password: credentials.password,
      },
    });
    const loginBody = await response.json();
    expect(response.status()).toBe(200);
    return loginBody.token;
  }

  //TC07
  static async getTokenWrongPassword(
    request: APIRequestContext,
  ): Promise<void> {
    const response = await request.post("/auth", {
      data: {
        username: credentials.username,
        password: credentials.wrongpassword,
      },
    });
    const loginBody = await response.json();
    expect(response.status()).toBe(200);
    expect(loginBody.reason).toBe("Bad credentials");
  }

  //TC08
  static async addReservation(
    request: APIRequestContext,
    token: string,
  ): Promise<void> {
    const response = await request.post("/booking", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        firstname: "John",
        lastname: "Doe",
        totalprice: 200,
        depositpaid: true,
        bookingdates: {
          checkin: "2026-06-01",
          checkout: "2026-06-07",
        },
        additionalneeds: "Breakfast",
      },
    });
    const addedReservation = await response.json();
    expect(response.status()).toBe(200);
    expect(addedReservation.booking.firstname).toBe("John");
    expect(addedReservation).toHaveProperty("bookingid");
  }
  //TC09
  static async addReservationAndVerify(
    request: APIRequestContext,
    token: string,
  ): Promise<string> {
    const responsePost = await request.post("/booking", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        firstname: "Jan",
        lastname: "Kowalski",
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: "2026-06-01",
          checkout: "2026-06-07",
        },
        additionalneeds: "Breakfast",
      },
    });
    const addedReservation = await responsePost.json();
    reservationId = addedReservation.bookingid;
    const responseGet = await request.get(`/booking/${reservationId}`);
    expect(responseGet.status()).toBe(200);
    expect(addedReservation.booking.firstname).toBe("Jan");
    expect(addedReservation.booking.lastname).toBe("Kowalski");
    return reservationId;
  }
  //TC10
  static async addInvalidReservation(
    request: APIRequestContext,
    token: string,
  ): Promise<void> {
    const response = await request.post("/booking", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        firstname: "Jan",
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: "2026-06-01",
          checkout: "2026-06-07",
        },
        additionalneeds: "Breakfast",
      },
    });
    expect(response.status()).toBe(500);
  }
  //TC11
  static async updateReservation(
    request: APIRequestContext,
    token: string,
  ): Promise<void> {
    const response = await request.put(`/booking/${reservationId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      data: {
        firstname: "Janusz",
        lastname: "Kowal",
        totalprice: 500,
        depositpaid: true,
        bookingdates: {
          checkin: "2026-06-01",
          checkout: "2026-06-07",
        },
        additionalneeds: "Breakfast",
      },
    });
    expect(response.status()).toBe(200);
  }

  //TC12
  static async updateReservationUsingPatch(
    request: APIRequestContext,
    token: string, 
    reservationData: any
  ): Promise<void> {
    const response = await request.patch(`/booking/${reservationId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      data: reservationData,
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody.firstname).toBe(reservationData.firstname);
    expect(responseBody.additionalneeds).toBe(reservationData.additionalneeds);
  }

  //TC13
  static async updateReservationWithoutToken(
    request: APIRequestContext,
  ): Promise<void> {
    const response = await request.put(`/booking/${reservationId}`, {
      data: {
        firstname: "Januszex",
        lastname: "Kowal",
        totalprice: 500,
        depositpaid: true,
        bookingdates: {
          checkin: "2026-06-01",
          checkout: "2026-06-07",
        },
        additionalneeds: "Breakfast",
      },
    });
    expect(response.status()).toBe(403);
  }

  //TC14

  static async updateReservationBasicAuthToken(
    request: APIRequestContext,
  ): Promise<void> {
    const response = await request.patch(`/booking/${reservationId}`, {
      headers: {
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      },
      data: {
        firstname: "Katarzynaaa",
        lastname: "Kowalskaaa",
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: "2026-06-01",
          checkout: "2026-06-07",
        },
        additionalneeds: "Breakfast",
      },
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody.firstname).toBe("Katarzynaaa");
  }
//TC15

  static async deleteReservation(
    request: APIRequestContext,
    token: string,
  ): Promise<void> {
    const response = await request.delete(`/booking/${reservationId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    expect(response.status()).toBe(201);
  }
//TC16
  static async verifyIfDeleted(
    request: APIRequestContext,): Promise<void> {
    const response = await request.get(`/booking/${reservationId}`);
    expect(response.status()).toBe(404);
  }

  //TC17
  static async deleteWithoutToken(
    request: APIRequestContext,): Promise<void> {
    const response = await request.delete(`/booking/${reservationId}`);
    expect(response.status()).toBe(403);
  }

//TC18 E2E flow
static async e2eFullFlow(
    request: APIRequestContext): Promise<void> {
      let token = await api.getToken(request);
      let reservaionID = await api.addReservationAndVerify(request,token);
      await api.updateReservationUsingPatch(request,token,testDataAdditionalNeeds);
      const response = await request.get(`/booking/${reservationId}`);
      const responseBody = await response.json();
      expect (responseBody.additionalneeds).toBe('Late checkout'); 
      await api.deleteReservation(request,token);
      await api.verifyIfDeleted(request);
  }
}
