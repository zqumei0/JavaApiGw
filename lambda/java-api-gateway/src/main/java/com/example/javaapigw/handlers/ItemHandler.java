package com.example.javaapigw.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import com.example.javaapigw.models.Item;
import com.example.javaapigw.service.ItemService;
import com.example.javaapigw.utils.HandlerUtils.HttpMethods;
import com.fasterxml.jackson.databind.type.TypeFactory;

import java.io.IOException;
import java.util.Map;

import static com.example.javaapigw.utils.HandlerUtils.generateItemId;

public class ItemHandler extends BaseHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    final private ItemService itemService;

    public ItemHandler() {
        itemService = new ItemService();
    }

    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        HttpMethods requestMethod = HttpMethods.valueOf(request.getHttpMethod().toUpperCase());

        switch (requestMethod){
            case GET: {
                final String itemId = request.getPathParameters().get("itemId");

                if (itemId == null) {
                    return badClientResponse();
                }

                final Item item = itemService.getItem(itemId);
                return successfulResponse(item.toString());
            }
            case DELETE: {
                final String itemId = request.getPathParameters().get("itemId");

                if (itemId == null) {
                    return badClientResponse();
                }

                final Item item = itemService.deleteItem(itemId);
                return successfulResponse(item.toString());
            }
            case POST: {
                final String requestBody = request.getBody();
                final Item item;

                try {
                    item = setupItem(requestBody);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }

                final String newId = itemService.createItem(item);
                return successfulResponse(newId);
            }
            default:
                return badClientResponse();
        }
    }

    private Item setupItem(String requestBody) throws IOException {
        TypeFactory typeFactory = objectMapper.getTypeFactory();
        Map<String, String> itemMapping = objectMapper.readValue(requestBody, typeFactory.constructMapLikeType(Map.class, String.class, String.class));

        String itemId = generateItemId();
        itemMapping.put("pk", itemId);

        return objectMapper.convertValue(itemMapping, Item.class);
    }
}
