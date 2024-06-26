import type { FC } from 'react';
import { Suspense, useState } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import type { RadioChangeEvent } from 'antd/es/radio';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type moment from 'moment';
import IntroduceRow1 from './components/IntroduceRow1';
import NAVHistoryCard from './components/NAVHistoryCard';
import ProportionSales from './components/ProportionSales';
import { useRequest } from 'umi';
import { queryMonitorData } from './service';
import PageLoading from './components/PageLoading';
import type { TimeType } from './components/NAVHistoryCard';
import { getTimeDistance } from './utils/utils';
import type { AnalysisData } from './data.d';
import styles from './style.less';
import PredictionUpdateCard from '@/pages/dashboard/analysis/components/PredictionUpdateCard';
import PredictionErrorUpdateCard from '@/pages/dashboard/analysis/components/PredictionErrorUpdateCard';
import ErrorWithFundCode from '@/pages/dashboard/analysis/components/ErrorWithFundCode';
import ErrorMaxAll from '@/pages/dashboard/analysis/components/ErrorMaxAll';
import ErrorMinAll from '@/pages/dashboard/analysis/components/ErrorMinAll';

type RangePickerValue = RangePickerProps<moment.Moment>['value'];

type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};

type SalesType = 'all' | 'online' | 'stores';

const Analysis: FC<AnalysisProps> = () => {
  const [salesType, setSalesType] = useState<SalesType>('all');
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('year'),
  );

  const { data, loading } = useRequest(() => {
    return queryMonitorData();
  });

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };

  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };

  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as moment.Moment, 'day') &&
      rangePickerValue[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  const menu = (
    <Menu>
      <Menu.Item>操作一</Menu.Item>
      <Menu.Item>操作二</Menu.Item>
    </Menu>
  );

  const dropdownGroup = (
    <span className={styles.iconGroup}>
      <Dropdown overlay={menu} placement="bottomRight">
        <EllipsisOutlined />
      </Dropdown>
    </span>
  );

  const handleChangeSalesType = (e: RadioChangeEvent) => {
    setSalesType(e.target.value);
  };

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow1 loading={loading} visitData={[]} />
        </Suspense>


        <Suspense fallback={null}>
          <NAVHistoryCard
            rangePickerValue={rangePickerValue}
            // @ts-ignore
            salesData={data?.historyData || []}
            isActive={isActive}
            handleRangePickerChange={handleRangePickerChange}
            loading={loading}
            selectDate={selectDate}
          />
        </Suspense>



        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <PredictionUpdateCard loading={loading} data={data?.latestPredictionData || []} />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <PredictionErrorUpdateCard />
            </Suspense>
          </Col>
        </Row>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                dropdownGroup={dropdownGroup}
                salesType={salesType}
                loading={loading}
                salesPieData={data?.basicFundTypeData || []}
                handleChangeSalesType={handleChangeSalesType}
              />
            </Suspense>
          </Col>
        </Row>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ErrorMaxAll />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ErrorMinAll />
            </Suspense>
          </Col>
        </Row>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ErrorWithFundCode />
            </Suspense>
          </Col>
        </Row>

        {/* <Suspense fallback={null}> */}
        {/*  <OfflineData */}
        {/*    loading={loading} */}
        {/*    offlineData={ []} */}
        {/*    offlineChartData={ []} */}
        {/*    handleTabChange={handleTabChange} */}
        {/*  /> */}
        {/* </Suspense> */}
      </>
    </GridContent>
  );
};

export default Analysis;
