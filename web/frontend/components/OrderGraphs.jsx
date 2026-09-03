import React, { useState } from 'react'
import { LegacyCard, Layout } from "@shopify/polaris";
import { storeData } from '../../../data'
import { Chart as ChartJs } from 'chart.js/auto'
import { Line, Doughnut, Bar } from 'react-chartjs-2'

export function OrderGraphs() {

    const [data, setData] = useState({
        labels: storeData.map((d) => d.year),
        datasets: [{
            label: 'Orders Details',
            data: storeData.map((d) => d.order),
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        }]
    });

    return (
        <>
            <Layout>
                <Layout.Section oneHalf>
                    <LegacyCard title="Total Order" sectioned>
                        <Line data={data} options={{ maintainAspectRatio: false, responsive: true }} />
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard title="Completed Order" sectioned>
                        <Doughnut data={data} options={{ maintainAspectRatio: false, responsive: true }} />
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard title="Remaining Order" sectioned>
                        <Bar data={data} options={{ maintainAspectRatio: false, responsive: true }} />
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </>
    )
}