package pt.uc.dei.proj5.dto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

import java.io.StringReader;

public class JsonCreator {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, true);
    }

    private static JsonObject parseJsonString(String jsonString) {
        try (JsonReader jsonReader = Json.createReader(new StringReader(jsonString))) {
            return jsonReader.readObject();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static JsonObject createJson(String type, String objectName, Object object) {
        try {
            String jsonString = objectMapper.writeValueAsString(object);
            JsonObject jsonObject = parseJsonString(jsonString); // Use static method

            return Json.createObjectBuilder()
                    .add("type", type)
                    .add(objectName, jsonObject) // Properly formatted JSON object
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}