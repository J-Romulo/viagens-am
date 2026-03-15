import { PageTitle } from '../../../../components/PageTitle';
import Loader from 'react-spinners/ClipLoader';
import { Revenue, GetRevenueParams } from '../../../../services/queries/Trips';
import { moneyMask } from '../../../../utils/masks';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../../components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface RevenueChartProps {
  isLoading: boolean;
  data: Revenue | undefined;
  params: GetRevenueParams;
  onParamsChange: (params: GetRevenueParams) => void;
}

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Realizado',
    color: '#4f46e5',
  },
  future: {
    label: 'Futuro',
    color: '#a5b4fc',
  },
};

function isFuturePeriod(period: string): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (/^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split('-').map(Number);
    return year > currentYear || (year === currentYear && month > currentMonth);
  }

  if (/^\d{4}-Q\d$/.test(period)) {
    const [year, q] = period.split('-Q').map(Number);
    const currentQuarter = Math.ceil(currentMonth / 3);
    return year > currentYear || (year === currentYear && q > currentQuarter);
  }

  if (/^\d{4}-S\d$/.test(period)) {
    const [year, s] = period.split('-S').map(Number);
    const currentSemester = currentMonth <= 6 ? 1 : 2;
    return year > currentYear || (year === currentYear && s > currentSemester);
  }

  return false;
}

export function RevenueChart({
  isLoading,
  data,
  params,
  onParamsChange,
}: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className='flex h-full w-full flex-col items-center rounded-lg bg-white'>
        <PageTitle title='Receita' />
        <Loader color={'#4f46e5'} loading={true} size={60} />
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col items-center rounded-lg bg-white'>
      <PageTitle title='Receita' />

      <div className='mb-4 flex w-full gap-3 px-4'>
        <Select
          value={params.period}
          onValueChange={(value) =>
            onParamsChange({
              ...params,
              period: value as GetRevenueParams['period'],
            })
          }
        >
          <SelectTrigger className='w-36'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1-year'>1 ano</SelectItem>
            <SelectItem value='2-year'>2 anos</SelectItem>
            <SelectItem value='5-year'>5 anos</SelectItem>
            <SelectItem value='all-time'>Todo o período</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={params.sort}
          onValueChange={(value) =>
            onParamsChange({
              ...params,
              sort: value as GetRevenueParams['sort'],
            })
          }
        >
          <SelectTrigger className='w-36'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='monthly'>Mensal</SelectItem>
            <SelectItem value='quarterly'>Trimestral</SelectItem>
            <SelectItem value='semester'>Semestral</SelectItem>
          </SelectContent>
        </Select>

        <div className='ml-auto flex gap-3'>
          <div className='flex flex-col items-center rounded-lg border border-gray-100 px-4 py-1.5 text-sm'>
            <span className='text-gray-600'>Total</span>
            <span className='font-semibold text-gray-700'>
              R$ {moneyMask((data?.total_revenue ?? 0).toFixed(2))}
            </span>
          </div>
          <div className='flex flex-col items-center rounded-lg border border-gray-100 px-4 py-1.5 text-sm'>
            <span className='text-gray-600'>Faturado</span>
            <span className='text-primary-500 font-semibold'>
              R$ {moneyMask((data?.past_revenue ?? 0).toFixed(2))}
            </span>
          </div>
          <div className='flex flex-col items-center rounded-lg border border-gray-100 px-4 py-1.5 text-sm'>
            <span className='text-gray-600'>Futuro</span>
            <span className='text-primary-300 font-semibold'>
              R$ {moneyMask((data?.future_revenue ?? 0).toFixed(2))}
            </span>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className='h-64 w-full'>
        <BarChart
          data={data?.revenue_by_period ?? []}
          margin={{ top: 4, right: 16, left: 16, bottom: 4 }}
        >
          <CartesianGrid vertical={false} stroke='#f0f0f0' />
          <XAxis
            dataKey='period'
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickFormatter={(value) => moneyMask(Number(value).toFixed(2))}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  `R$ ${moneyMask(Number(value).toFixed(2))}`
                }
              />
            }
          />
          <Bar dataKey='revenue' radius={[4, 4, 0, 0]}>
            {(data?.revenue_by_period ?? []).map((entry) => (
              <Cell
                key={entry.period}
                fill={
                  isFuturePeriod(entry.period)
                    ? 'var(--color-future)'
                    : 'var(--color-revenue)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
