require 'rails_helper'

describe "Genetic Algorithm" do
  it "reads file" do
    data_filename = "#{File.dirname(__FILE__)}/../lib/travel_cost.csv"
    data_set = DataSet.new.load_csv_with_labels data_filename
    data_set.data_items.collect! {|column| column.collect {|element| element.to_f}}

    Chromosome.set_cost_matrix(data_set.data_items)

    search = GeneticSearch.new(800, 100)
    result = search.run

    expect(result.normalized_fitness).to eq(1.0)
  end
end
