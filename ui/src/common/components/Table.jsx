import React, { useMemo } from "react";
import { useTable, useFlexLayout, useGlobalFilter, useSortBy } from "react-table";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";

const buildColumns = (key) => {
  switch (key) {
    default:
      return {
        Header: key,
        accessor: key,
      };
  }
};

const Table = ({ data, onRowClick, components }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableData = useMemo(() => data, []);

  const columns = Object.keys(data[0]).map((key) => {
    return buildColumns(key);
  });

  const tableColumns = useMemo(
    () => [...columns],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      width: 150, // width is used for both the flex-basis and flex-grow
    }),
    []
  );

  const tableInstance = useTable(
    { columns: tableColumns, data: tableData, defaultColumn },
    useFlexLayout,
    useGlobalFilter,
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <>
      <Box as="table" {...getTableProps()} flex={1} fontSize="delta" w="100%">
        <Box as="thead">
          {headerGroups.map((headerGroup) => (
            <Flex
              as="tr"
              flex={1}
              {...headerGroup.getHeaderGroupProps({})}
              pb={4}
              borderBottom="3px solid"
              borderColor="bluefrance"
            >
              {headerGroup.headers.map((column, i) => (
                <Text
                  as="th"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  display={"flex"}
                  fontWeight="bold"
                  overflow="hidden"
                  borderColor="grey.800"
                  color="grey.800"
                  px={5}
                >
                  <Stack direction="row" alignItems="center" justifyContent="center">
                    <Text>{column.render("Header")}</Text>
                  </Stack>
                </Text>
              ))}
            </Flex>
          ))}
        </Box>
        <Box as="tbody" {...getTableBodyProps()}>
          {rows.map((row, j) => {
            prepareRow(row);
            return (
              <Box
                as="tr"
                {...row.getRowProps()}
                display="flex"
                key={row.id}
                data-rowindex={row.index}
                onClick={() => onRowClick?.(row.index)}
                cursor={onRowClick ? "pointer" : undefined}
                h="auto!important"
                color="grey.800"
                bg={j % 2 === 0 ? "galt" : "white"}
                py="3"
              >
                {row.cells.map((cell, i) => {
                  return (
                    <Box as="td" {...cell.getCellProps()} display={"flex"} px={5} overflow="hidden">
                      {components && components[cell.column.id] ? (
                        components[cell.column.id](cell.value, cell.row.id)
                      ) : !cell.value ? (
                        <Text color="grey.500">N.A</Text>
                      ) : (
                        cell.render("Cell")
                      )}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export { Table };