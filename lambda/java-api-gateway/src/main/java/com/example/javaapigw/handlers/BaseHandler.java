package com.example.javaapigw.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.HttpURLConnection;

public abstract class BaseHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    protected final ObjectMapper objectMapper = new ObjectMapper();

    protected static APIGatewayProxyResponseEvent successfulResponse(String apiResponse) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(HttpURLConnection.HTTP_OK)
                .withBody(apiResponse);
    }
    protected static APIGatewayProxyResponseEvent badClientResponse() {
        return new APIGatewayProxyResponseEvent().withStatusCode(HttpURLConnection.HTTP_BAD_REQUEST);
    }

    protected static APIGatewayProxyResponseEvent badInternalResponse() {
        return new APIGatewayProxyResponseEvent().withStatusCode(HttpURLConnection.HTTP_INTERNAL_ERROR);
    }
}
