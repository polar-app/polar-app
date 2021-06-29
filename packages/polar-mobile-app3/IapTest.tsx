import * as RNIap from 'react-native-iap';
import {Platform, Text, FlatList, StyleSheet, View} from 'react-native';
import {Product} from 'react-native-iap';
import React, {Component} from 'react';

export class IapTest extends Component<any,
    {
        products: Product[];
    }> {
    componentDidMount() {
        const productIds = Platform.select({
            ios: ['plan_plus'],
            android: ['com.example.coins100'],
        });

        RNIap.getProducts(productIds!)
            .then(products => {
                this.setState({products});
                console.log(products);
            })
            .catch(reason => {
                console.warn(reason.code);
                console.warn(reason.message);
            });
    }

    render() {
        return (
            <View>
                <Text style={styles.text}>Products available for purchase:</Text>
                <FlatList
                    data={this.state && this.state.products ? this.state.products : []}
                    keyExtractor={item => item.productId}
                    renderItem={({item}) => (
                        <Text
                            style={styles.item}
                            onPress={async () => {
                                try {
                                    await RNIap.requestPurchase(item.productId, false);
                                    // @TODO attach listeners for new purchase
                                } catch (err) {
                                    console.warn(err.code, err.message);
                                }
                            }}>
                            {'- ' + item.title + ' - ' + item.price + ' ' + item.currency}
                        </Text>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    text: {
        fontSize: 22,
        color: '#fff',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#FFF',
    },
});
