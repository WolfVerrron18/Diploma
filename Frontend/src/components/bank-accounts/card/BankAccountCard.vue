<template>
  <div class="bank-account-card">
    <div class="bank-account-card__wrapper">
      <div class="bank-account-card__content">
        <SystemInput class="bank-account-card__item" label="Название" :disabled="readonly" />

        <SystemInput label="Описание" type-field="textarea" :disabled="readonly" />

        <SystemSelect label="Валюта" :options="currencyOptions">
          <template #option="{ option }">
            {{ currencyList[option.value] }} {{ option.label }}
          </template>
        </SystemSelect>

        <Doughnut class="bank-account-card__chart" :options="chartOptions" :data="chartData" />

        <el-button class="bank-account-card__btn" type="primary"> Сохранить </el-button>
      </div>

      <SystemTabs class="bank-account-card__tabs" :tabs="tabs" />
    </div>
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

import SystemInput from '@/components/system/SystemInput.vue'
import { computed } from 'vue'
import SystemTabs from '@/components/system/SystemTabs.vue'
import SystemSelect from '@/components/system/SystemSelect.vue'
import { currencyList, enumCurrencyId } from '@/components/bank-accounts/enums/enumCurrency.js'

export default {
  name: 'BankAccountCard',

  components: { SystemSelect, SystemTabs, SystemInput, Doughnut },

  props: {
    /** @param {boolean} readonly - Режим только чтения */
    readonly: {
      type: Boolean,
      default: false
    },

    /** @param {string} mode - Режим работы с карточкой */
    mode: {
      type: String,
      default: 'edit',
      validator(cardMode) {
        return ['edit', 'create'].includes(cardMode)
      }
    }
  },

  setup(props, { emit }) {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

    const isMode = computed(() => ({
      edit: props.mode === 'edit',
      create: props.mode === 'create'
    }))

    const tabs = computed(() => {
      return [
        {
          id: 'general',
          title: 'Общее'
        },
        {
          id: 'history',
          title: 'История'
        }
      ]
    })

    const currencyOptions = [
      {
        value: enumCurrencyId.ruble,
        label: 'Рубль'
      },
      {
        value: enumCurrencyId.dollar,
        label: 'Доллар'
      },
      {
        value: enumCurrencyId.euro,
        label: 'Евро'
      }
    ]

    const chartData = {
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          displayName: 'Аналитика',
          data: [40, 20, 12],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
          hoverOffset: 4
        }
      ]
    }

    const chartOptions = {
      responsive: true
    }

    return { chartData, chartOptions, currencyOptions, currencyList, tabs }
  }
}
</script>

<style scoped lang="scss">
.bank-account-card {
  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 100px;
    gap: 10px;
  }

  &__item:not(:last-child) {
    margin-bottom: 16px;
  }

  &__chart {
    height: 300px !important;
    width: 300px !important;
    margin: 16px auto;
  }

  &__btn {
    display: block;
    margin: auto;
  }
}
</style>
