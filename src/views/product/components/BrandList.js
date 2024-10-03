import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import NoRecordFound from "../../../components/NoRecordFound";
import Refresh from "../../../components/Refresh";
import SearchBar from "../../../components/SearchBar";
import ShowMore from "../../../components/ShowMore";
import Spinner from "../../../components/Spinner";
import Status from "../../../helper/Status";
import brandService from "../../../services/BrandService";
import ListCard from "../components/ListCard";

const BrandList = (props) => {
  let { activeTab,refreshing,setRefreshing } = props;
  const [brandList, setBrandList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [isFetching, setIsFetching] = useState(false);
  const [HasMore, setHasMore] = useState(true);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  useEffect(() => {
    getBrandList({search : searchPhrase});
  }, [isFocused]);
  useEffect(() => {
    if(refreshing){      
      getBrandList({search : searchPhrase});
    }
  }, [refreshing]);

  const getBrandList = async (values) => {
    
    brandList && brandList.length == 0 && setIsLoading(true);
    await brandService.search({ status: Status.ACTIVE_TEXT ,search : values ? values?.search : ""}, (response) => {
      setBrandList(response);
      setIsLoading(false);
    });
  };

  const handleChange = async (search) => {
    getBrandList({search : search})
  };

  const branLoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params = { page: page, status: Status.ACTIVE_TEXT };

      await brandService.search(params, (response) => {
        let brand = response;

        // Set response in state
        setBrandList((prevTitles) => {
          return [...new Set([...prevTitles, ...brand])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(brand.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          setClicked={setClicked}
          clicked={clicked}
          onPress={getBrandList}
          handleChange={handleChange}
          noScanner
        />
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
      

        <View>
          <>
            {brandList && brandList.length > 0 ? (
              brandList.map((brand, index) => {
                return (
                  <ListCard
                    name={brand.name}
                    index={index}
                    onPress={() => {
                      navigation.navigate("Products", {
                        brandId: brand?.id,
                      });
                    }}
                  />
                );
              })
            ) : (
              <NoRecordFound iconName={"receipt"} />
            )}
            <ShowMore
              List={brandList}
              isFetching={isFetching}
              HasMore={HasMore}
              onPress={branLoadMoreList}
            />
          </>
        </View>
      </Refresh>
    </>
  );
};
export default BrandList;
