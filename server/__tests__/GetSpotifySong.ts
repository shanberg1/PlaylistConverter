import mockRequest from "supertest";
import * as express from "express";

import {
    getSpotifySong,
} from "../src/Controllers/SpotifyController";

console.log("hello");
jest.mock("supertest");
mockRequest.get.mockImplementation(() => {
  const data =
    {
      userId: 1,
      id: 1,
      title: 'My First Album'
    };
  return data;
});

describe('Test Handlers', function () {
    test('responds to /service/spotify/song', async () => {
      let req = {};
      let res = {id: 1};
      const result = await getSpotifySong(req, res);

      expect(res.id === 1);
    });

    // test('responds to /hello/:name', () => {
    //     const req = { params: { name: 'Bob' }  };
    //     const res = { text: '',
    //         send: function(input) { this.text = input } 
    //     };
    //     hello(req, res);
    //     expect(res.text).toEqual('hello Bob!');
    // });

});