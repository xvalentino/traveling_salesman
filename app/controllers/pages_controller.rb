require 'reloader/sse'

class PagesController < ApplicationController
  include ActionController::Live
  def home
  end

  def feed
    response.headers['Content-Type'] = 'text/event-stream'
    sse = Reloader::SSE.new(response.stream)
    begin
      1000.times do |i|
        sse.write({ msg: i })
        puts i
        sleep(1)
      end
      sse.write("stream_end")
    rescue IOError
    ensure
      sse.close
    end
  end
end
