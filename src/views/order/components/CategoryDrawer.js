import React, { useState, useEffect } from "react";

import BottomDrawer from "../../../components/BottomDrawer";

import { Text, View } from "react-native";

import { List } from 'react-native-paper';

import { Color } from '../../../helper/Color';

import { CheckBox } from 'react-native-elements';
import ArrayList from "../../../lib/ArrayList";

const CategoryListDrawer = ({ isOpen, onClose, categoryList, brandList, selectedCategory, selectedBrand, onApplyFilter, searchPhrase, setSelectedCategoryFilter, setSelectedBrandFilter }) => {

  const [selectedCategories, setSelectedCategory] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState([]);

  let isCategoryChecked;

  let isBrandChecked;

  useEffect(() => {
    setSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedBrands(selectedBrand);
  }, [selectedBrand]);

  const onCategoryCheckBoxClick = (value, selectedFilter) => {

    let categoryFilters;

    if (selectedFilter && selectedCategories.length > 0) {

      categoryFilters = selectedCategories;

      let categoryIndex = categoryFilters.findIndex((data) => data == selectedFilter.value);

      if (categoryIndex > -1) {
        categoryFilters.splice(categoryIndex, 1);
      } else {
        categoryFilters.push(selectedFilter.value);
      }

      setSelectedCategory([...categoryFilters]);

    } else {
      categoryFilters = new Array();

      categoryFilters.push(selectedFilter.value);

      setSelectedCategory(categoryFilters);

    }

  }

  const onBrandCheckBoxClick = (value, selectedFilter) => {

    let brandFilters;

    if (selectedFilter && selectedBrands.length > 0) {

      brandFilters = selectedBrands;

      let brandIndex = selectedBrands.findIndex((data) => data == selectedFilter.value);

      if (brandIndex > -1) {
        brandFilters.splice(brandIndex, 1);
      } else {
        brandFilters.push(selectedFilter.value);
      }

      setSelectedBrands([...brandFilters]);

    } else {
      brandFilters = new Array();

      brandFilters.push(selectedFilter.value);

      setSelectedBrands(brandFilters);

    }

  }

  const onFilterPress = () => {
    onClose();
    setSelectedCategoryFilter([...selectedCategories]);
    setSelectedBrandFilter([...selectedBrands]);
    onApplyFilter(searchPhrase, selectedCategories, selectedBrands)
  }

  return (
    <>
      <BottomDrawer isOpen={isOpen} closeDrawer={onClose} title={"Category"} applyFilter={onFilterPress}>

        <List.Section>

          <List.Accordion title={"Categories"} titleStyle={{ color: Color.BLACK, fontWeight: "bold" }}>

            {categoryList && categoryList.length > 0 && categoryList.map((data) => {

              isCategoryChecked = ArrayList.isNotEmpty(selectedCategories) ? selectedCategories.findIndex((value) => value == data.value) > -1 ? true : false : false;

              return (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "between", marginTop: 10, marginLeft: 5 }}>

                  <View style={{ flex: 0.9, justifyContent: "center" }}>
                    <Text>{data.label}</Text>
                  </View>

                  <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <CheckBox
                      checked={isCategoryChecked}
                      onPress={() => onCategoryCheckBoxClick(!isCategoryChecked, data)}
                      containerStyle={{ backgroundColor: 'white', borderWidth: 0, marginLeft: 0, marginRight: 0 }}
                      checkedColor="black"
                    />
                  </View>

                </View>
              )
            })}

          </List.Accordion>

        </List.Section>

        <List.Section>

          <List.Accordion title={"Brands"} titleStyle={{ color: Color.BLACK, fontWeight: "bold" }}>

            {brandList && brandList.length > 0 && brandList.map((data) => {

              isBrandChecked = selectedBrands && selectedBrands.length > 0 ? selectedBrands.findIndex((value) => value == data.value) > -1 ? true : false : false;

              return (
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "between", marginTop: 5, marginLeft: 5 }}>

                  <View style={{ flex: 0.9, justifyContent: "center" }}>
                    <Text>{data.label}</Text>
                  </View>

                  <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <CheckBox
                      checked={isBrandChecked}
                      onPress={() => onBrandCheckBoxClick(!isBrandChecked, data)}
                      containerStyle={{ backgroundColor: 'white', borderWidth: 0, marginLeft: 0, marginRight: 0 }}
                      checkedColor="black"
                    />
                  </View>


                </View>
              )
            })}

          </List.Accordion>

        </List.Section>

      </BottomDrawer>
    </>
  )
};

export default CategoryListDrawer;