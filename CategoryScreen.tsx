import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import React, {useState} from 'react';
import categories from './staticData.json';

const SingleItem = ({
  category,
  index,
  selectedCategory,
  style,
  onPress,
}: any) => {
  const isSelected = selectedCategory === category.id;
  return (
    <Pressable
      android_ripple={{color: 'grey'}}
      onPress={onPress}
      style={[
        {
          backgroundColor: isSelected ? 'blue' : 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          width: 70,
          alignSelf: 'center',
          padding: 4,
          borderRadius: 4,
          elevation: 5,
          marginTop: index === 0 ? 20 : 0,
        },
        style,
      ]}>
      <Image source={{uri: category.image}} style={{width: 50, height: 50}} />
      <Text style={{paddingVertical: 5, color: isSelected ? 'white' : '#888'}}>
        {category.name}
      </Text>
    </Pressable>
  );
};

const CategoryScreen = () => {
  const [ref, setRef] = useState(null);
  const [enableListener, setEnableListener] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(
    'c66cb48d-8534-4227-9467-07016890ed95',
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    '478c71dc-da34-4863-a571-9fbf58df7d84',
  );
  const [dataSourceCords, setDataSource] = useState([]);

  const scrollToSubcatView = category => {
    console.log('NN=>', category, dataSourceCords);
    if (dataSourceCords.length && ref) {
      const cat = dataSourceCords.find(c => c.id === category);
      setSelectedCategory(category);
      setEnableListener(false);
      ref?.scrollTo({
        x: 0,
        y: cat.start,
        animated: true,
      });
      setTimeout(() => {
        setEnableListener(true);
      }, 1000);
    }
  };

  const onScroll = e => {
    if (enableListener) {
      let position = e.nativeEvent.contentOffset.y;
      let cu = dataSourceCords.find(
        e => e.start < position && e.end > position,
      );
      cu && setSelectedCategory(cu.id);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', flex: 8, elevation: 6, zIndex: 5}}>
        <View style={{flex: 2, backgroundColor: '#f9f9f9'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((category, index) => (
              <SingleItem
                category={category}
                key={`__item__${index}`}
                index={index}
                selectedCategory={selectedCategory}
                onPress={() => scrollToSubcatView(category.id)}
              />
            ))}
          </ScrollView>
        </View>
        <View style={{flex: 6, paddingHorizontal: 10}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={160}
            ref={ref => setRef(ref)}>
            {categories.map((category, index) => (
              <View
                key={`__itemCC__${index}`}
                onLayout={e => {
                  setDataSource([
                    ...dataSourceCords,
                    {
                      id: category.id,
                      start: e.nativeEvent.layout.y,
                      end: e.nativeEvent.layout.y + e.nativeEvent.layout.height,
                    },
                  ]);
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'blue',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingVertical: 10,
                    borderBottomColor: '#888',
                    borderBottomWidth: 1,
                    borderStyle: 'dashed',
                  }}>
                  {category.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                  }}>
                  {category.subCategory.map((subcategory, index) => (
                    <SingleItem
                      stickyHeaderIndices={[0]}
                      category={subcategory}
                      key={`__sitem__${index}`}
                      index={index}
                      selectedCategory={selectedSubCategory}
                      style={{width: 80}}
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default CategoryScreen;
