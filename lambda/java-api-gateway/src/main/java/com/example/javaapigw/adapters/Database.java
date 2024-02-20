package com.example.javaapigw.adapters;


import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

public class Database {
    private static final DynamoDbEnhancedClient enhancedClient = DynamoDbEnhancedClient.create();
}
