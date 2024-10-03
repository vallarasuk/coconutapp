
//React
import React from "react";
import { View, ScrollView } from "react-native";

//Components
import Select from "../../../components/Select";
import Currency from "../../../components/Currency";
import FileUpload from "../../../components/FileUpload";
import AddButton from "../../../components/AddButton";
import TextInput from "../../../components/TextInput";
import VerticalSpace10 from "../../../components/VerticleSpace10";

const ProductForm = (props) => {
  const {
    control,
    brandList,
    categoryList,
    weightUnitOptions,
    handleBrand,
    handleStatus,
    handleCategory,
    handleUnit,
    statusOptions,
    StatusData,
    brandData,
    categoryData,
    unitData,
    onPress,
    details,
    image,
    setImage,
    setFile,
    allowEdit,
    statusUpdatePermission,
    isSubmit
  } = props;
    
  return (
    <ScrollView>
      <View style={{ marginTop: 10, padding: 10 }}>
        <FileUpload image={image ? image : ""} prefillImage={details?.image} setImage={setImage} setFile={setFile} />
        <TextInput
          title="Name"
          name="name"
          placeholder="Product Name"
          control={control}
          required
          editable={allowEdit }
          values = {details?.name}
        />
        <VerticalSpace10  />

        <Select
          options={statusOptions}
          data={StatusData}
          getDetails={handleStatus}
          label={"Status"}
          disable={(!allowEdit == false) && (statusUpdatePermission == true) ? false : !details ? false :  true}
          name = {"status"}
          placeholder={"Select Status"}
          control={control}
        />
        <VerticalSpace10  />

        <Select
          options={brandList}
          getDetails={handleBrand}
          data={brandData}
          label={"Brand"}
          name = {"brand_id"}
          placeholder={"Select Brand"}
          disable={!allowEdit }
          control={control}
        />
        <VerticalSpace10  />

        <Select
          options={categoryList}
          getDetails={handleCategory}
          data={categoryData}
          label={"Category"}
          name = {"category_id"}
          placeholder={"Select Category"}
          disable={!allowEdit }
          control={control}
        />
        <VerticalSpace10  />

      
            <TextInput
              title="Size"
              name="size"
              placeholder="Enter Size"
              control={control}
              keyboardType="numeric"
              editable={allowEdit}

            />
        <VerticalSpace10  />
        <TextInput
              title="Rack#"
              name="rack_number"
              placeholder="Enter Rack#"
              control={control}
              keyboardType="numeric"
              editable={allowEdit}

            />
                    <VerticalSpace10  />


            <Select
              options={weightUnitOptions}
              getDetails={handleUnit}
              data={unitData}
              label={"Unit"}
              placeholder={"Select Unit"}
              paddingVertical
              control={control}
              name = {"unit"}
              disable={!allowEdit}

            />

        <VerticalSpace10  />
   
      

        <View style={{ paddingVertical: 20 }}>
       {allowEdit &&  <AddButton data={details?.name} onPress={onPress} isSubmit ={isSubmit}/>}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductForm;
