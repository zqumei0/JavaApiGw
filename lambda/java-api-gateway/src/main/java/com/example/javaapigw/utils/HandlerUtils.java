package com.example.javaapigw.utils;

import java.util.UUID;

public class HandlerUtils {
    public enum HttpMethods {
        GET,
        POST,
        DELETE,
        OPTIONS,
    }

    public static String generateItemId() {
        return UUID.randomUUID().toString();
    }
}
