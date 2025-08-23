'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';

interface MultiChartsProps {
  usersData: any[];
  formsStatusData: any[];
  formsTrendData: any[];
  contactsData: any[];
}

const MultiCharts: React.FC<MultiChartsProps> = ({
  usersData,
  formsStatusData,
  formsTrendData,
  contactsData
}) => {
  const chartBlue = '#60a5fa'; // blue-400 for better contrast on dark bg
  const chartLightBlue = 'rgba(147,197,253,0.55)'; // translucent fill
  const gridColor = 'rgba(255,255,255,0.18)';
  const axisColor = '#ffffff';
  const tooltipStyle = { background: 'rgba(17,24,39,0.45)', color: '#fff', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 } as React.CSSProperties;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Users Growth */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-white">Users Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor }} />
                <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="users" stroke={chartBlue} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forms Status Distribution */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-white">Forms Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formsStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor }} />
                <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill={chartBlue} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forms Trends */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-white">Forms Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor }} />
                <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="pending" stackId="1" stroke={chartBlue} fill={chartLightBlue} />
                <Area type="monotone" dataKey="reviewed" stackId="1" stroke="#93c5fd" fill="rgba(191,219,254,0.55)" />
                <Area type="monotone" dataKey="filed" stackId="1" stroke="#bfdbfe" fill="rgba(219,234,254,0.45)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contacts per Month */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-white">Contacts Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contactsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor }} />
                <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="contacts" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MultiCharts;
