require "sinatra"
require "uri"
require "json"
require "net/http"
require "logger"
require "benchmark"

set :bind, "0.0.0.0"
logger = Logger.new(STDOUT)

# TODO(allow language is only japanese now)
uri = "https://eastasia.api.cognitive.microsoft.com/vision/v2.0/ocr?language=ja"

# set SUBSCRIPTION_KEY in os environment variable with your valid subscription key.
subscriptionKey = ENV['SUBSCRIPTION_KEY']
if !subscriptionKey then
  STDERR.puts("please set SUBSCRIPTION_KEY in os environment variable")
  exit 1
end

get "/healthz" do
  return "ok".to_json
end

# Input: image file
# Output: title list(JSON format)
post "/ocr" do
  logger.info("request params: " + params.to_s)

  image = nil
  if params[:image][:type] then
    if params[:image][:type].match(/^image\/[a-z]+/) then # image/*
      image = params[:image][:tempfile]
    else
      logger.info("unallowed file type(" + params[:image][:type] + ")")
      return {
        err: "unallowed file type.",
        titles: nil,
      }.to_json
    end
  else
    logger.info("no data were uploaded.")
    return {
      err: "no data were uploaded.",
      titles: nil,
    }.to_json
  end

  url = URI.parse(uri)

  req = Net::HTTP::Post.new(url.request_uri)
  req["Content-Type"] = "application/octet-stream"
  req["Ocp-Apim-Subscription-Key"] = subscriptionKey
  req.body = image.read

  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
#  http.set_debug_output $stderr

  res = nil
  req_time = Benchmark.realtime do
    res = http.request(req)
  end

  logger.info("ocr time: " + req_time.to_s + "[sec]")

  if !(200 <= res.code.to_i && res.code.to_i < 300)
    logger.warn("request OCR failed(" + res.code+"): " + res.message)
    return {
      err: "failed to request OCR",
      titles: nil,
    }.to_json
  end

  titles = Array.new
  JSON.parse(res.body)["regions"].each do |region|
    region["lines"].each do |line|
      word = String.new
      line["words"].each do |w|
        word += w["text"]
      end
      titles.push(word)
    end
  end
  logger.info("send titles: " + titles.to_s)

  return {
    err: nil,
    titles: titles,
  }.to_json
end
