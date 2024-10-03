import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import AlternativeColor from "../../components/AlternativeBackground";
import Layout from "../../components/Layout";
import NoRecordFound from "../../components/NoRecordFound";
import Refresh from "../../components/Refresh";
import SalaryCard from "../../components/SalaryCard";
import styles from "../../helper/Styles";
import SalaryService from "../../services/SalaryService";
import ShowMore from "../../components/ShowMore";

const SalaryListPage = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [salaryList, setSalaryList] = useState([]);
  const [HasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(2);
  let navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    getSalaryList();
  }, [isFocused]);
  useEffect(() => {
    if (refreshing) {
      getSalaryList();
    }
  }, [refreshing]);

  let getSalaryList = async () => {
    salaryList && salaryList.length == 0 && setIsLoading(true);
    await SalaryService.search({}, (err, res) => {
      let data = res && res.data && res.data.data;
      setSalaryList(data);
      setIsLoading(false);
      setRefreshing(false);
      setPage(2);
    });
  };

  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params = { page: page };

      await SalaryService.search(params, (err,response) => {
        let salaryList = response && response.data && response.data.data;
        setSalaryList((prevTitles) => {
          return [...new Set([...prevTitles, ...salaryList])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(salaryList.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);

    }
  };

  return (
    <Layout
      title="Salary"
      showBackIcon={false}
      refreshing={refreshing}
      isLoading={isLoading}
    >
      <Refresh
        refreshing={refreshing}
        setRefreshing={setRefreshing}
        isLoading={isLoading}
      >
        <View>
          {salaryList && salaryList.length > 0 ? (
            salaryList.map((item, index) => {
              const containerStyle = AlternativeColor.getBackgroundColor(index);

              return (
                <TouchableOpacity
                  style={[styles.leadContainer, containerStyle]}
                  onPress={() => {
                    navigation.navigate("SalaryDetailPage", { item });
                  }}
                >
                  <View style={styles.row}>
                    <View>
                      <SalaryCard
                        firstName={item?.first_name}
                        lastName={item?.last_name}
                        image={item?.image_url}
                        month={item?.month}
                        year={item?.year}
                        status={item?.status}
                        statusColor={item?.colorCode}
                        size={60}
                        amount={item?.net_salary}
                        avatarStyle={{
                          width: 55,
                          height: 55,
                          borderRadius: 30,
                        }}
                        onPress={() => {
                          navigation.navigate("SalaryDetailPage", { item });
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <NoRecordFound iconName={"money-bill-wave-alt"} />
          )}
          <ShowMore
            List={salaryList}
            isFetching={isFetching}
            HasMore={HasMore}
            onPress={LoadMoreList}
          />
        </View>
      </Refresh>
    </Layout>
  );
};

export default SalaryListPage;
