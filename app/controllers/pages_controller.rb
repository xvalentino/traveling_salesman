require 'reloader/sse'

class PagesController < ApplicationController
  include ActionController::Live
  def home
  end

  def feed
    response.headers['Content-Type'] = 'text/event-stream'
    sse = Reloader::SSE.new(response.stream)

    data_filename = "#{File.dirname(__FILE__)}/../../lib/travel_cost.csv"
    data_set = DataSet.new.load_csv_with_labels data_filename
    data_set.data_items.collect! {|column| column.collect {|element| element.to_f}}
    Chromosome.set_cost_matrix(data_set.data_items)

    max_generation = params['gen'].to_i
    max_generation = 100 if max_generation > 100
    population = params['pop'].to_i
    population = 1000 if population > 1000
    mutation_rate = params['mutation'].to_f

    search = GeneticSearch.new(population, max_generation, mutation_rate)
    begin
      search.generate_initial_population                    #Generate initial population 
      max_generation.times do
        selected_to_breed = search.selection                #Evaluates current population 
        offsprings = search.reproduction selected_to_breed  #Generate the population for this new generation
        search.replace_worst_ranked offsprings
        sse.write({route: search.best_chromosome.data, fitness: -search.best_chromosome.fitness.to_i})
      end
      sse.write("stream_end")
    rescue IOError
    ensure
      sse.close
    end
  end
end
