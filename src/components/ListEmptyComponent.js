import React from "react";
import { Text, View } from "react-native";

const ListEmptyComponent = ({ title, viewStyle, titleStyle }) => {
    return (
        <View style={viewStyle}>
            <Text style={titleStyle}>
                {title}
            </Text>
        </View>
    );
};

export default ListEmptyComponent;