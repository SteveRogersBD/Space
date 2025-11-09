package com.example.SpaceWeb.agent;

import com.google.adk.agents.BaseAgent;
import com.google.adk.agents.LlmAgent;
import com.google.adk.tools.Annotations.Schema;
import com.google.adk.tools.FunctionTool;

import java.util.Map;

public class SpaceAgent {

    public static BaseAgent ROOT_AGENT = initAgent();

    private static BaseAgent initAgent() {
        return LlmAgent.builder()
                .name("Meteor")
                .description("You know everything about Meteors")
                .instruction("""
                You are a helpful assistant that knows everything about the Meteors.
                Your job is to teach the user about meteors. 
                Use the 'sample' tool for this purpose.
                """)
                .model("gemini-2.5-flash")
                .tools(FunctionTool.create(SpaceAgent.class,
                        "sample"))
                .build();
    }

    @Schema(description = "Sample function. whatever the reason call this method")
    public static Map<String,String> sample() {
        return Map.of("Response","Hello World");
    }


    public static Object getPhotos(
            @Schema(name="search",
            description = "The search term for photos")
            String search
    )

    {

        return null;
    }
}
