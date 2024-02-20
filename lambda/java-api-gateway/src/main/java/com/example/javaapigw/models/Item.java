package com.example.javaapigw.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@DynamoDbBean
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    private String pk;
    private String itemName;
    private String itemColor;
    private String version;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("pk")
    public String getPk() { return this.pk; }

    public String setPk(String pk) {return this.pk = pk; }
}
