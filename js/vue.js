

const { createApp, ref, reactive } = Vue

  const app = createApp({
    setup() {
      const myHeight = ref('170')
      const myMass = ref('60')
      const bicMass = ref('15')
      const bagMass = ref('0')
      const tireDia = ref('700')
      const airTemp = ref('25')
      const windVelocity = ref('0')
      const roadSlope = ref('0')
      const myInclin = ref('80')
      const myVelocity = ref('15')
      const calc_result = ref('')
      const data_velocity_watt = ref('')


      var myChart;
      var graph_data;

      function calc(){
        calc_result.value = calcPower(myHeight.value, myMass.value,bicMass.value,bagMass.value,tireDia.value,airTemp.value,windVelocity.value,roadSlope.value,myInclin.value,myVelocity.value )
        data_velocity_watt.value = generate_watt2velocity(myHeight.value, myMass.value)
      }

      calc()
     
      function convert_data_for_graph(){

          graph_data = []
          data_velocity_watt.value.forEach(function(elem, index) {
              graph_data.push({x: elem["watt"], y: elem["velocity"]})
          });

      }

      convert_data_for_graph() 

      function makeGraph(){
            const ctx = document.getElementById('myChart').getContext('2d');
            if (myChart) {
              myChart.destroy();
            }
            myChart = new Chart(ctx, {
                type: 'scatter',
                data: { 
                  datasets: [
                    {
                      label: "エアロバイクの負荷Wと実際の自転車の速度の関係",
                      data: graph_data 
                    }
                 ] }, 
                options: {
                    plugin: {
                        title: {
                            text: ""
                        }
                    },
                    scales: {
                        x: {
                            title: {
                              text: "負荷W",
                              display: true
                            },
                            display: true    
                           },
                        y: {
                            title: {
                              text: "速度(km/h)",
                              display: true
                            },
                            display: true    
                           }
                    }
                }
            })
      }


      function onInput(e) {
        myHeight.value = e.target.value
        calc()
        convert_data_for_graph()
        makeGraph()

      }

      function onInput2(e) {
        myMass.value = e.target.value
        calc()
        convert_data_for_graph()
        makeGraph()

      }


      const inputStyle = reactive({
        textAlign: 'right',
        fontSize: '13px'
      })

      const box1 = reactive({
        width:  '30%',
        background: '#b3d874',
        float : 'left'
      })

      const box2 = reactive({
        width:  '60%',
        float : 'right'
      })



      return { myHeight, myMass,myVelocity,  onInput, onInput2,  calc_result, inputStyle ,data_velocity_watt ,box1, box2, 
               calc,convert_data_for_graph,makeGraph }
    },
    mounted() {
        this.calc()
        this.convert_data_for_graph()
        this.makeGraph()
    },
    template: `
      <h1>エアロバイクの自転車換算速度</h1>
      <p>体重、身長などから,エアロバイクで運動した時、本物の自転車でどのくらいの速度が出るのか計算します</p>
      <a>身長:</a>
      <input :value="myHeight" @input="onInput" :style="inputStyle"><a>cm</a>
      <br>
      <a>体重:</a>
      <input :value="myMass" @input="onInput2" :style="inputStyle"><a>kg</a>
      <br>
    
      <div :style="box1"> 
        <a> 身長が{{myHeight}}, 体重が{{myMass}}kgの場合のワット数に対しての速度</a>
        <table border="1">
          <thead>
            <tr>
              <th>ワット数(W)</th>
              <th>速度(km/h)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data_velocity_watt " :key="index">
              <td>{{ item.watt }}</td>
              <td>{{ item.velocity }}</td>
            </tr>
          </tbody>
        </table>
    </div>
    <div :style="box2">
      <canvas id="myChart" width="300" height="300"></canvas>
    </div>
    <div style="clear:both">
      <p>各種計算条件は下記の通りです</p>
      <p>自転車の質量: 15kg </p>
      <p>自転車の車輪の外径: 700mm </p>
      <p>気温: 25℃</p>
      <p>風速: 0m/s </p>
      <p>道路勾配: 0° </p>
      <p>胴傾き角: 80° </p>
      <p>滑らかな舗装でシティバイクを想定 </p>
      <p>詳しい計算方法は、下記サイトで解説しています</p>
      https://qiita.com/bohemian916/items/de40b6db26ddcb74bb4c
    </div>
    `
  })



  function test(){
  console.log("test")

}

  app.mount('#app')
