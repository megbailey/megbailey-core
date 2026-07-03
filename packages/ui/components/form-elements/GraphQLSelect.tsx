import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";

import Select from "./Select";

import {resolveAmbiguousPath} from "../../../utils/objectTraversal";

export const parseJSONOptionValue = ( event: any ) => {
    if ( Array.isArray( event.value ) ) {
        return event.value.map( (item: any) => JSON.parse( item.value ) )
    } else if ( event.value?.value ) {
        return JSON.parse( event.value.value )
    } else {
        return [];
    }
}

const isCallableFunction = ( func: any ) => {
    if ( func && typeof func === 'function' ) 
        return true
    console.warn(`${func} prop is not callable function.`)
    return false;
}

export type GraphQLObjectSelectProps = {
    label?: string;
    field?: string;
    initialValue?: any;
    endpointDataPath?: string;
    query?: any;
    queryVariables?: Record<string, any>;
    attachAbortController?: boolean;
    formatOptionLabel?: (item: any) => string;
    formatGroupLabel?: (item: any) => string;
    groupOptionsCallback?: (options: any[]) => any;
    onLoadingChange?: (loading: boolean) => void;
    onChange?: (value: any) => void;
    [key: string]: any;
}

const GraphQLObjectSelect = ({
    label,
    field,
    initialValue = [],
    endpointDataPath = 'endpoint.data',
    query = gql`query { endpoint { ...endpointFragment } }`,
    queryVariables = {},
    attachAbortController = false,
    formatOptionLabel,
    formatGroupLabel,
    groupOptionsCallback,
    onLoadingChange,
    onChange,
    ...other
}: GraphQLObjectSelectProps) => {

    const [ APIData, setAPIData ] = useState<any[]>([])
    //const { getController } = useAbortController()
    const [ getAPIData, { loading, error, data }]= useLazyQuery(query);

    const renderLabel = ( item: any, functionName: 'formatOptionLabel' | 'formatGroupLabel' ) => {
        if ( functionName === 'formatOptionLabel' && formatOptionLabel && isCallableFunction( formatOptionLabel ) )
            return formatOptionLabel( item )
        
        else if ( functionName === 'formatGroupLabel' && formatGroupLabel && isCallableFunction( formatGroupLabel ) )
            return formatGroupLabel( item )

        return item.label || item.name || item.title || `Unknown ${functionName === 'formatGroupLabel' ? 'Group' : 'Option'} Label`
    }

    const genSelectOptions = ( data: any ): any => {
        if ( !data ) return [];

        if ( Array.isArray(data) ) {
            const options = data.map(item => ({
                label: renderLabel( item, 'formatOptionLabel' ),
                value: JSON.stringify( item )
            }))

            if ( groupOptionsCallback && isCallableFunction( groupOptionsCallback ) )
                return groupOptionsCallback( options )

            return options;
        }

        return {
            label: renderLabel( data, 'formatGroupLabel' ),
            value: JSON.stringify( data )
        }
    }

    useEffect(() => {
        getAPIData({ 
            variables: queryVariables,
            /* context: attachAbortController 
                ? { fetchOptions: { signal: getController().signal } }
                : null */
        })
    }, [ JSON.stringify( queryVariables ) ])

    useEffect(() => {
        if ( onLoadingChange && typeof onLoadingChange === 'function' )
            onLoadingChange( loading )
    }, [ loading ])

    useEffect(() => {
        if ( loading === false && data && Object.keys(data).length > 0 ) {
            const resolvedData = resolveAmbiguousPath( data, endpointDataPath )
            setAPIData( resolvedData )
         } else if ( error ) {
            console.error(`Unable to fetch GraphQL '${endpointDataPath}' data.`, error);
        }
    }, [error, data])
    
    if ( loading || !data ) return null;

    return (
        <Select
            field={field}
            label={label}
            formatGroupLabel={( group: any ) => renderLabel( group, 'formatGroupLabel' )}
            options={genSelectOptions( APIData )}
            initialValue={genSelectOptions( initialValue )}
            onChange={(e: any) => {
                if (onChange) {
                    onChange({ 
                        ...e,
                        value: parseJSONOptionValue( e ) 
                    })
                }
            }}
            {...other}
        />
    )
};

export default GraphQLObjectSelect;