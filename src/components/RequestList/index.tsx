import React, { useState } from 'react';
import useSWR from 'swr';
import type { RequestResultsResponse } from '../../../server/interfaces/api/requestInterfaces';
import LoadingSpinner from '../Common/LoadingSpinner';
import RequestItem from './RequestItem';
import Header from '../Common/Header';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  requests: 'Requests',
  mediaInfo: 'Media Info',
  status: 'Status',
  requestedAt: 'Requested At',
  modifiedBy: 'Last Modified By',
  showingresults:
    'Showing <strong>{from}</strong> to <strong>{to}</strong> of <strong>{total}</strong> results',
  next: 'Next',
  previous: 'Previous',
  filterAll: 'All',
  filterPending: 'Pending',
  filterApproved: 'Approved',
  noresults: 'No results.',
  showallrequests: 'Show All Requests',
  sortAdded: 'Request Date',
  sortModified: 'Last Modified',
});

type Filter = 'all' | 'approved' | 'pending';
type Sort = 'added' | 'modified';

const RequestList: React.FC = () => {
  const intl = useIntl();
  const [pageIndex, setPageIndex] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<Filter>('pending');
  const [currentSort, setCurrentSort] = useState<Sort>('added');

  const { data, error, revalidate } = useSWR<RequestResultsResponse>(
    `/api/v1/request?take=10&skip=${
      pageIndex * 10
    }&filter=${currentFilter}&sort=${currentSort}`
  );
  if (!data && !error) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return <LoadingSpinner />;
  }

  const hasNextPage = data.pageInfo.pages > pageIndex + 1;
  const hasPrevPage = pageIndex > 0;

  return (
    <>
      <div className="flex flex-col justify-between md:items-end md:flex-row">
        <Header>{intl.formatMessage(messages.requests)}</Header>
        <div className="flex flex-col md:flex-row">
          <div className="flex mb-2 md:mb-0 md:mr-2">
            <span className="inline-flex items-center px-3 text-gray-100 bg-gray-800 border border-r-0 border-gray-500 cursor-default rounded-l-md sm:text-sm">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <select
              id="filter"
              name="filter"
              onChange={(e) => {
                setPageIndex(0);
                setCurrentFilter(e.target.value as Filter);
              }}
              onBlur={(e) => {
                setPageIndex(0);
                setCurrentFilter(e.target.value as Filter);
              }}
              value={currentFilter}
              className="flex-1 block w-full py-2 pl-3 pr-10 text-base leading-6 text-white bg-gray-700 border-gray-500 rounded-r-md form-select focus:outline-none focus:ring-blue focus:border-gray-500 sm:text-sm sm:leading-5 disabled:opacity-50"
            >
              <option value="all">
                {intl.formatMessage(messages.filterAll)}
              </option>
              <option value="pending">
                {intl.formatMessage(messages.filterPending)}
              </option>
              <option value="approved">
                {intl.formatMessage(messages.filterApproved)}
              </option>
            </select>
          </div>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-gray-100 bg-gray-800 border border-r-0 border-gray-500 cursor-default rounded-l-md sm:text-sm">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
            </span>
            <select
              id="sort"
              name="sort"
              onChange={(e) => {
                setPageIndex(0);
                setCurrentSort(e.target.value as Sort);
              }}
              onBlur={(e) => {
                setPageIndex(0);
                setCurrentSort(e.target.value as Sort);
              }}
              value={currentSort}
              className="flex-1 block w-full py-2 pl-3 pr-10 text-base leading-6 text-white bg-gray-700 border-gray-500 rounded-r-md form-select focus:outline-none focus:ring-blue focus:border-gray-500 sm:text-sm sm:leading-5 disabled:opacity-50"
            >
              <option value="added">
                {intl.formatMessage(messages.sortAdded)}
              </option>
              <option value="modified">
                {intl.formatMessage(messages.sortModified)}
              </option>
            </select>
          </div>
        </div>
      </div>
      <Table>
        <thead>
          <Table.TH>{intl.formatMessage(messages.mediaInfo)}</Table.TH>
          <Table.TH>{intl.formatMessage(messages.status)}</Table.TH>
          <Table.TH>{intl.formatMessage(messages.requestedAt)}</Table.TH>
          <Table.TH>{intl.formatMessage(messages.modifiedBy)}</Table.TH>
          <Table.TH></Table.TH>
        </thead>
        <Table.TBody>
          {data.results.map((request) => {
            return (
              <RequestItem
                request={request}
                key={`request-list-${request.id}`}
                revalidateList={() => revalidate()}
              />
            );
          })}

          {data.results.length === 0 && (
            <tr className="relative w-full h-24 p-2 text-white bg-gray-800">
              <Table.TD colSpan={6} noPadding>
                <div className="flex flex-col items-center justify-center p-4">
                  <span>{intl.formatMessage(messages.noresults)}</span>
                  {currentFilter !== 'all' && (
                    <div className="mt-4">
                      <Button
                        buttonSize="sm"
                        buttonType="primary"
                        onClick={() => setCurrentFilter('all')}
                      >
                        {intl.formatMessage(messages.showallrequests)}
                      </Button>
                    </div>
                  )}
                </div>
              </Table.TD>
            </tr>
          )}
          <tr>
            <Table.TD colSpan={6} noPadding>
              <nav
                className="flex items-center justify-between px-4 py-3 text-white bg-gray-700"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm">
                    {intl.formatMessage(messages.showingresults, {
                      from: pageIndex * 10,
                      to:
                        data.results.length < 10
                          ? pageIndex * 10 + data.results.length
                          : (pageIndex + 1) * 10,
                      total: data.pageInfo.results,
                      strong: function strong(msg) {
                        return <span className="font-medium">{msg}</span>;
                      },
                    })}
                  </p>
                </div>
                <div className="flex justify-start flex-1 sm:justify-end">
                  <span className="mr-2">
                    <Button
                      disabled={!hasPrevPage}
                      onClick={() => setPageIndex((current) => current - 1)}
                    >
                      {intl.formatMessage(messages.previous)}
                    </Button>
                  </span>
                  <Button
                    disabled={!hasNextPage}
                    onClick={() => setPageIndex((current) => current + 1)}
                  >
                    {intl.formatMessage(messages.next)}
                  </Button>
                </div>
              </nav>
            </Table.TD>
          </tr>
        </Table.TBody>
      </Table>
    </>
  );
};

export default RequestList;
