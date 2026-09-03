import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export default function Card({ title, data, ProductCard, CollectionCard, OrderCard, FulfilledCard, PendingCard }) {
    return (
        <>
            <Layout.Section oneHalf>
                <LegacyCard title={title} sectioned>
                    <h1>
                        {ProductCard && data}
                        {CollectionCard && data}
                        {OrderCard && data}
                        {FulfilledCard && data}
                        {PendingCard && data}
                    </h1>
                </LegacyCard>
            </Layout.Section>
        </>
    )
}
