import { useEffect, useState } from "react";
import { useLazyQuery, type DocumentNode } from "@apollo/client";
import gql from "graphql-tag";
import type { GroupBase, OnChangeValue, OptionsOrGroups } from "react-select";

import InformedSelect, { type InformedSelectOption } from "./InformedSelect";
import type { FormFieldChangeEvent } from "./types";
import { isCallableFunction } from "./types";

import { resolveAmbiguousPath } from "../../../utils/helpers/traversal";

type GraphQLSelectChangeEvent<TItem> = FormFieldChangeEvent<TItem | TItem[]>;

export type GraphQLSelectItem = Record<string, unknown> & {
    label?: string;
    name?: string;
    title?: string;
};

export type GraphQLSelectProps<TItem extends GraphQLSelectItem = GraphQLSelectItem> = {
    label?: string;
    field?: string;
    initialValue?: TItem | TItem[];
    endpointDataPath?: string;
    query?: DocumentNode;
    queryVariables?: Record<string, unknown>;
    attachAbortController?: boolean;
    formatOptionLabel?: (item: TItem) => string;
    formatGroupLabel?: (group: GroupBase<InformedSelectOption>) => string;
    groupOptionsCallback?: (
        options: InformedSelectOption[]
    ) => OptionsOrGroups<InformedSelectOption, GroupBase<InformedSelectOption>>;
    onLoadingChange?: (loading: boolean) => void;
    onChange?: (event: GraphQLSelectChangeEvent<TItem>) => void;
    isMulti?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
};

/** @deprecated Use GraphQLSelectProps instead */
export type GraphQLObjectSelectProps<TItem extends GraphQLSelectItem = GraphQLSelectItem> =
    GraphQLSelectProps<TItem>;

export const parseJSONOptionValue = (
    event: FormFieldChangeEvent<OnChangeValue<InformedSelectOption, boolean>>
): unknown => {
    if (Array.isArray(event.value)) {
        return event.value.map((item) => JSON.parse(item.value));
    }

    if (event.value && "value" in event.value) {
        return JSON.parse(event.value.value);
    }

    return [];
};

const GraphQLSelect = <TItem extends GraphQLSelectItem = GraphQLSelectItem>({
    label,
    field,
    initialValue = [],
    endpointDataPath = "endpoint.data",
    query = gql`
        query {
            endpoint {
                ...endpointFragment
            }
        }
    `,
    queryVariables = {},
    attachAbortController = false,
    formatOptionLabel,
    formatGroupLabel,
    groupOptionsCallback,
    onLoadingChange,
    onChange,
    ...other
}: GraphQLSelectProps<TItem>) => {
    const [APIData, setAPIData] = useState<TItem[]>([]);
    const [getAPIData, { loading, error, data }] = useLazyQuery(query);

    const renderLabel = (
        item: TItem | GroupBase<InformedSelectOption>,
        functionName: "formatOptionLabel" | "formatGroupLabel"
    ): string => {
        if (
            functionName === "formatOptionLabel" &&
            formatOptionLabel &&
            isCallableFunction<(item: TItem) => string>(formatOptionLabel, "formatOptionLabel")
        ) {
            return formatOptionLabel(item as TItem);
        }

        if (
            functionName === "formatGroupLabel" &&
            formatGroupLabel &&
            isCallableFunction<(group: GroupBase<InformedSelectOption>) => string>(
                formatGroupLabel,
                "formatGroupLabel"
            )
        ) {
            return formatGroupLabel(item as GroupBase<InformedSelectOption>);
        }

        const record = item as GraphQLSelectItem;
        return (
            record.label ||
            record.name ||
            record.title ||
            `Unknown ${functionName === "formatGroupLabel" ? "Group" : "Option"} Label`
        );
    };

    const genSelectOptions = (
        source: TItem | TItem[] | null | undefined
    ): OptionsOrGroups<InformedSelectOption, GroupBase<InformedSelectOption>> => {
        if (!source) {
            return [];
        }

        if (Array.isArray(source)) {
            const options = source.map((item) => ({
                label: renderLabel(item, "formatOptionLabel"),
                value: JSON.stringify(item),
            }));

            if (
                groupOptionsCallback &&
                isCallableFunction<
                    (
                        options: InformedSelectOption[]
                    ) => OptionsOrGroups<InformedSelectOption, GroupBase<InformedSelectOption>>
                >(groupOptionsCallback, "groupOptionsCallback")
            ) {
                return groupOptionsCallback(options);
            }

            return options;
        }

        return [
            {
                label: renderLabel(source, "formatGroupLabel"),
                value: JSON.stringify(source),
            },
        ];
    };

    useEffect(() => {
        getAPIData({
            variables: queryVariables,
            /* context: attachAbortController
                ? { fetchOptions: { signal: getController().signal } }
                : null */
        });
    }, [JSON.stringify(queryVariables)]);

    useEffect(() => {
        if (onLoadingChange) {
            onLoadingChange(loading);
        }
    }, [loading, onLoadingChange]);

    useEffect(() => {
        if (loading === false && data && Object.keys(data).length > 0) {
            const resolvedData = resolveAmbiguousPath(data, endpointDataPath) as TItem[];
            setAPIData(resolvedData);
        } else if (error) {
            console.error(`Unable to fetch GraphQL '${endpointDataPath}' data.`, error);
        }
    }, [error, data, loading, endpointDataPath]);

    if (loading || !data) {
        return null;
    }

    return (
        <InformedSelect
            field={field}
            label={label}
            formatGroupLabel={(group) => renderLabel(group, "formatGroupLabel")}
            options={genSelectOptions(APIData)}
            initialValue={genSelectOptions(initialValue)}
            onChange={(event) => {
                if (onChange) {
                    onChange({
                        ...event,
                        value: parseJSONOptionValue(event) as TItem | TItem[],
                    });
                }
            }}
            {...other}
        />
    );
};

export default GraphQLSelect;
